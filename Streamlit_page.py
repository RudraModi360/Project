import streamlit as st
import uuid
import requests
from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.chat_message_histories import ChatMessageHistory

st.set_page_config(page_title="Ayurvedic Chatbot", layout="wide")

# Session management
if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())
if "chat_history" not in st.session_state:
    st.session_state.chat_history = ChatMessageHistory()
if "store" not in st.session_state:
    st.session_state.store = {}

# API endpoint
API_URL = "https://projectuvicorn-localhost-server-main-app.onrender.com"

# Session history management
def get_chat_session_history(session_id: str):
    if session_id not in st.session_state.store:
        st.session_state.store[session_id] = ChatMessageHistory()
    return st.session_state.store[session_id]

# Display chat history in the left sidebar
st.sidebar.title("Chat History")

# Store past sessions if not already present
if "past_sessions" not in st.session_state:
    st.session_state.past_sessions = []

# Show past sessions
for session_id, messages in reversed(st.session_state.past_sessions):
    with st.sidebar.expander(f"Session {session_id[:8]}", expanded=False):
        for msg in messages:
            role = "User" if isinstance(msg, HumanMessage) else "AI"
            st.sidebar.markdown(f"**{role}:** {msg.content}")

# Display current session history in the left sidebar
with st.sidebar.expander(
    f"Current Session {st.session_state.session_id[:8]}", expanded=True
):
    for message in st.session_state.chat_history.messages:
        role = "User" if isinstance(message, HumanMessage) else "AI"
        st.sidebar.markdown(f"**{role}:** {message.content}")

# Main chat UI
st.title("AyuHelper")

user_input = st.chat_input("Ask AyuHelper about your health...")

if user_input:
    with st.spinner("Processing your request..."):
        # Send request to backend API
        response = requests.post(
            f"{API_URL}/chat",
            json={
                "message": user_input,
                "user_id": st.session_state.session_id
            },
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        )
        
        if response.status_code == 200:
            response_data = response.json()
            answer = response_data["answer"]
            google_links = response_data.get("google_links", [])
            youtube_videos = response_data.get("youtube_videos", [])
            
            # Update chat history
            st.session_state.chat_history.add_message(HumanMessage(content=user_input))
            st.session_state.chat_history.add_message(AIMessage(content=answer))
            
            # Display YouTube videos if available
            if youtube_videos:
                with st.sidebar.expander("📺 Related Videos", expanded=True):
                    for i, video_url in enumerate(youtube_videos, 1):
                        st.markdown(f"### Video {i}")
                        st.video(video_url)
                        st.markdown("---")
            
            # Display Google links if available
            if google_links:
                with st.sidebar.expander("🔍 Related Articles", expanded=True):
                    for i, link in enumerate(google_links, 1):
                        st.markdown(f"### Article {i}")
                        st.markdown(f"📄 [Click to read the full article]({link})")
                        st.markdown("---")
        else:
            st.error("Failed to get response from the server. Please try again.")

# Display current session history in chat window
for message in st.session_state.chat_history.messages:
    role = "User" if isinstance(message, HumanMessage) else "AI"
    with st.chat_message(role.lower()):
        st.markdown(message.content)

# Function to start a new session while keeping past history in the sidebar
def start_new_session():
    st.session_state.past_sessions.append(
        (st.session_state.session_id, list(st.session_state.chat_history.messages))
    )
    st.session_state.session_id = str(uuid.uuid4())
    st.session_state.chat_history = ChatMessageHistory()
    st.rerun()

# Button to start a new session
if st.sidebar.button("Start New Session"):
    start_new_session()
