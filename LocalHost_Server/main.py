from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import uuid
from dotenv import load_dotenv

from LocalHost_Server.retriever import get_rag_chain
from LocalHost_Server.chat_history import get_chat_session_history
from langchain_core.messages import HumanMessage, AIMessage

# Load environment variables
load_dotenv()

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


class ChatResponse(BaseModel):
    answer: str
    session_id: str


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
            
            if "answer" not in response:
                # Try to extract answer from different response formats
                if isinstance(response.get("output"), str):
                    response["answer"] = response["output"]
                elif isinstance(response.get("response"), str):
                    response["answer"] = response["response"]
                else:
                    raise ValueError(f"Cannot find answer in response: {response}")
                    
        except Exception as chain_error:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate response: {str(chain_error)}"
            )

        # Add the new messages to the chat history
        chat_history.add_user_message(request.message)
        chat_history.add_ai_message(response["answer"])

        # Return the response
        return ChatResponse(answer=response["answer"], session_id=session_id)
    except HTTPException as http_error:
        raise http_error
    except Exception as e:
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
