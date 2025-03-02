from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from typing import Dict, List, Optional
from .supabase_client import supabase, fetch_data, insert_into_table

# Store for active users
store: Dict[str, ChatMessageHistory] = {}

# Function to get or create a chat history for a user
def get_user_history(user_id: str) -> BaseChatMessageHistory:
    """Get or create a chat history for the given user ID"""
    if user_id not in store:
        store[user_id] = ChatMessageHistory()
        # Load existing chat history from Supabase
        records = fetch_data(user_id)
        if isinstance(records, list):
            for record in records:
                store[user_id].add_user_message(record['message'])
                store[user_id].add_ai_message(record['response'])
    return store[user_id]

# Function to start a new chat for a user
def start_new_chat(user_id: str) -> None:
    """Start a new chat for the given user ID"""
    # Clear existing chat history for the user
    store[user_id] = ChatMessageHistory()

# Function to get all active users
def get_all_users() -> List[str]:
    """Get a list of all active user IDs"""
    return list(store.keys())


