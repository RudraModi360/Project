from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import uuid
import requests
from dotenv import load_dotenv
from LocalHost_Server.models import get_llm
from LocalHost_Server.retriever import get_rag_chain
from LocalHost_Server.chat_history import get_chat_session_history
from langchain_core.messages import HumanMessage, AIMessage

# Load environment variables
load_dotenv()

llm=get_llm()
# Google Search API configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyB7sfStkrXLwzxEBfFtGxcmCnfxra0OEmQ")
GOOGLE_SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "d3c4eae8e0bc44663")
GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1"

# Initialize FastAPI app
app = FastAPI(
    title="AyuHelper API",
    description="API for Ayurvedic health assistant chatbot",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the RAG chain
rag_chain = get_rag_chain()
# Store active sessions
sessions = {}


# Pydantic models for request and response
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

def get_google_queries(response: str, llm) -> str:
    prompt = f"""
    Analyze the given response: {response}.
    Generate a concise, one-line Ayurvedic remedy for a common cough (max 50 words).
    Then, based on this remedy, provide a focused Google search query to find the most relevant Ayurvedic solutions.
    Only return the search query without extra explanations.
    """
    return llm.invoke(prompt).content

def has_recipe(response: str, llm) -> bool:
    prompt = f"""
    Analyze this response and determine if it contains any Ayurvedic recipe or remedy instructions:
    {response}
    Return only 'true' if it contains a recipe/remedy, or 'false' if it doesn't.
    """
    result = llm.invoke(prompt).content.lower().strip()
    return result == 'true'

# YouTube Data API endpoint and configuration
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "AIzaSyB7sfStkrXLwzxEBfFtGxcmCnfxra0OEmQ")
YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search"

def get_youtube_videos(response: str, llm) -> str:
    prompt = f"""
    Analyze the given response: {response}.
    If there are any Ayurvedic remedies or treatments mentioned, create a focused YouTube search query to find relevant tutorial videos.
    Only return the search query without extra explanations.
    """
    query = llm.invoke(prompt).content
    # Format the query for URL
    formatted_query = query.strip().replace(' ', '+')
    return f"https://www.youtube.com/results?search_query={formatted_query}"

# Update ChatResponse model
class ChatResponse(BaseModel):
    answer: str
    session_id: str
    google_links: List[str] = []
    youtube_videos: List[Dict[str, str]] = []


class SessionResponse(BaseModel):
    session_id: str
    message: str


@app.get("/")
async def root():
    return {"message": "Welcome to AyuHelper API"}


import traceback

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        session_id = request.session_id or str(uuid.uuid4())
        chat_history = get_chat_session_history(session_id)

        formatted_history = []
        for message in chat_history.messages:
            if isinstance(message, HumanMessage):
                formatted_history.append({"type": "human", "content": message.content})
            elif isinstance(message, AIMessage):
                formatted_history.append({"type": "ai", "content": message.content})

        print(f"Received message: {request.message}")
        print(f"Formatted history: {formatted_history}")
        print(f"Session ID: {session_id}")

        if not rag_chain:
            raise ValueError("RAG chain is not initialized")

        print("Sending to RAG chain:", {"input": request.message, "chat_history": formatted_history})

        # Call the RAG chain
        response = rag_chain.invoke(
            {"input": request.message, "chat_history": formatted_history},
            config={"configurable": {"session_id": session_id}},
        )

        print("Raw RAG chain response:", response)

        if not isinstance(response, dict):
            raise ValueError(f"Unexpected response type: {type(response)}, content: {response}")

        answer = response.get("answer") or response.get("output") or response.get("response")

        if not answer:
            raise ValueError(f"No valid answer found in response structure: {response}")

        chat_history.add_user_message(request.message)
        chat_history.add_ai_message(answer)

        return ChatResponse(
            answer=answer,
            session_id=session_id,
            google_links=[],
            youtube_videos=[]
        )

    except Exception as chain_error:
        print("RAG Chain Error:", str(chain_error))
        traceback.print_exc()  # <-- Add this to see full error details
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(chain_error)}"
        )



        # Add the new messages to the chat history
        chat_history.add_user_message(request.message)
        chat_history.add_ai_message(answer)

        # Return the response with Google links and YouTube videos
        return ChatResponse(
            answer=answer,
            session_id=session_id,
            google_links=[],  # Will be populated if recipe is found
            youtube_videos=[]  # Will be populated if recipe is found
        )
        
    except HTTPException as http_error:
        raise http_error
    except Exception as e:
        # Log unexpected errors
        print(f"Unexpected error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@app.post("/new_session", response_model=SessionResponse)
async def new_session():
    # Generate a new session ID
    session_id = str(uuid.uuid4())

    # Initialize an empty chat history for this session
    get_chat_session_history(session_id)

    return SessionResponse(session_id=session_id, message="New session created")


@app.get("/sessions/{session_id}/history")
async def get_session_history(session_id: str):
    # Get chat history for this session
    chat_history = get_chat_session_history(session_id)

    # Format the history for response
    formatted_history = []
    for message in chat_history.messages:
        if isinstance(message, HumanMessage):
            formatted_history.append({"role": "user", "content": message.content})
        elif isinstance(message, AIMessage):
            formatted_history.append({"role": "assistant", "content": message.content})

    return {"history": formatted_history}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)