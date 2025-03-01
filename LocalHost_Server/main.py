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
from googlesearch import search
from LocalHost_Server.fetch import *

# Load environment variables
load_dotenv()

llm = get_llm()

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

# Update ChatResponse model
class ChatResponse(BaseModel):
    answer: str
    session_id: str
    google_links: List[str] = []
    youtube_videos: List[str] = []


class SessionResponse(BaseModel):
    session_id: str
    message: str


@app.get("/")
async def root():
    return {"message": "Welcome to AyuHelper API"}


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Get or create session ID
        session_id = request.session_id or str(uuid.uuid4())
        # Get chat history for this session
        chat_history = get_chat_session_history(session_id)

        # Convert chat history to the format expected by the RAG chain
        formatted_history = []
        for message in chat_history.messages:
            if isinstance(message, HumanMessage):
                formatted_history.append({"type": "human", "content": message.content})
            elif isinstance(message, AIMessage):
                formatted_history.append({"type": "ai", "content": message.content})

        # Generate response using the RAG chain
        try:
            response = rag_chain.invoke(
                {"input": request.message, "chat_history": formatted_history},
                config={"configurable": {"session_id": session_id}},
            )
            # Check response structure
            if not isinstance(response, dict):
                raise ValueError(f"Unexpected response type: {type(response)}")

            # Extract answer from response with better error handling
            answer = None
            if "answer" in response:
                answer = response["answer"]
            elif isinstance(response.get("output"), str):
                answer = response["output"]
            elif isinstance(response.get("response"), str):
                answer = response["response"]

            if not answer:
                raise ValueError(
                    f"No valid answer found in response structure: {response}"
                )

        except Exception as chain_error:
            # Log the error for debugging
            print(f"RAG Chain Error: {str(chain_error)}")
            print(
                f"Response structure: {response if 'response' in locals() else 'No response generated'}"
            )
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate response: {str(chain_error)}",
            )

        # Add the new messages to the chat history
        chat_history.add_user_message(request.message)
        chat_history.add_ai_message(answer)
        # Check if response contains a recipe and fetch external links
        youtube_videos = []
        article_links = []
        article_links = fetch_article_links(answer, llm)
        youtube_videos = fetch_youtube_links(answer, llm)
        return ChatResponse(
            answer=answer,
            session_id=session_id,
            google_links=article_links,
            youtube_videos=youtube_videos,
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
    port = int(os.getenv("PORT", 8000))  # Render sets the port via the PORT env variable
    uvicorn.run(app, host="0.0.0.0", port=port)