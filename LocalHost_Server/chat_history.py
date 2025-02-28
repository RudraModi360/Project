from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from typing import Dict, List, Optional

# Store for all chat sessions
store: Dict[str, ChatMessageHistory] = {}

# Function to get or create a chat history for a session
def get_chat_session_history(session_id: str) -> BaseChatMessageHistory:
    """Get or create a chat history for the given session ID"""
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# Function to start a new session
def start_new_session(old_session_id: Optional[str] = None) -> str:
    """Start a new chat session and optionally archive the old one"""
    # Generate a new session ID
    import uuid
    new_session_id = str(uuid.uuid4())
    
    # Initialize an empty chat history for the new session
    store[new_session_id] = ChatMessageHistory()
    
    return new_session_id

# Function to get all active sessions
def get_all_sessions() -> List[str]:
    """Get a list of all active session IDs"""
    return list(store.keys())



