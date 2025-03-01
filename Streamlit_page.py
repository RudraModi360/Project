import streamlit as st
import uuid
import os
import requests
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_ollama import OllamaEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain.chains import create_history_aware_retriever
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
import time

st.set_page_config(page_title="Ayurvedic Chatbot", layout="wide")

os.environ["LANGCHAIN_TRACING"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = "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"
os.environ["LANGCHAIN_PROJECT"] = "Streamlit-Ayu"

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.2-90b-vision-preview",
    temperature=0.8,
)

# Session management
if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())
if "chat_history" not in st.session_state:
    st.session_state.chat_history = ChatMessageHistory()
if "store" not in st.session_state:
    st.session_state.store = {}

# Initialize retriever and embeddings
embedding_model = OllamaEmbeddings(model="nomic-embed-text:latest")
vector_db = FAISS.load_local(
    "DB", embeddings=embedding_model, allow_dangerous_deserialization=True
)
retriever = vector_db.as_retriever()

# Prompt setup
retriever_prompt = "Based on the provided chat history and the user's latest question — which may reference prior context — rephrase the question into a self-contained query that is clear without relying on the chat history. Do not answer the question; simply reformulate it if necessary, or return it unchanged."

context_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", retriever_prompt),
        ("human", "{input}"),
    ]
)

history_aware_retriever = create_history_aware_retriever(llm, retriever, context_prompt)

with_memory_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
    # Goal
    Provide Ayurvedic guidance for common illnesses with simple, safe home remedies. Recommend consulting a doctor if necessary.
    
    ## Conversation Flow
    
    ### 1. First-Time User Check
    - If this is the first interaction, ask about:
    - Body nature (*Vata, Pitta, Kapha*).
    - Any known allergies, sensitivities, digestion issues, or chronic conditions.
    - Use `{context}` to store and recall user information for future queries.
    
    ### 2. Assessing the Current Issue
    - Ask specific details about the illness:
    - Symptoms and their duration.
    - Any relevant lifestyle or dietary habits.
    - Maintain a warm and caring tone.
    
    ### 3. Personalized Ayurvedic Remedies
    - Suggest simple, step-by-step remedies using common kitchen ingredients.
    - Tailor recommendations based on the person's *Dosha* and health history from `{context}`.
    - Keep responses clear, short, and practical.
    
    ### 4. Precautions and Lifestyle Tips
    - Highlight important do's and don'ts.
    - Recommend basic dietary and lifestyle changes for better recovery.
    
    ### 5. When to Seek Medical Help
    - Clearly advise when professional care is needed.
    - Remind that home remedies are for mild to moderate conditions only.
    
    ## Warnings
    - Ensure all remedies are safe and side-effect-free.
    - Gently suggest medical attention if symptoms worsen or are severe.
    
    ## Tone
    - Simple, short, and easy to understand.
    - Soft, humble, and professional.
    - Indian English style—relatable and conversational.
    
    ## Identity
    I am AyuHelper, created by Team Ayurnetra today. I offer Ayurvedic advice like a caring Vaidya, always here to help.
    """,
        ),
        ("human", "{input}"),
    ]
)

history_chain = create_stuff_documents_chain(llm, with_memory_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, history_chain)


# Session history management
def get_chat_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in st.session_state.store:
        st.session_state.store[session_id] = ChatMessageHistory()
    return st.session_state.store[session_id]


def get_google_queries(response):
    prompt = f"""
    Analyze the given response: {response}.
    Generate a concise, one-line Ayurvedic remedy for a common cough (max 50 words).
    Then, based on this remedy, provide a focused Google search query to find the most relevant Ayurvedic solutions.
    Only return the search query without extra explanations.
    """
    return llm.invoke(prompt).content


def get_youtube_videos(response):
    prompt = f"""
    Analyze the given response: {response}.
    If there are any Ayurvedic remedies or treatments mentioned, create a focused YouTube search query to find relevant tutorial videos.
    Only return the search query without extra explanations.
    """
    query = llm.invoke(prompt).content
    # Format the query for URL
    formatted_query = query.strip().replace(' ', '+')
    return f"https://www.youtube.com/results?search_query={formatted_query}"

# YouTube Data API endpoint and configuration
youtube_api_key = "AIzaSyB7sfStkrXLwzxEBfFtGxcmCnfxra0OEmQ"
youtube_url = "https://www.googleapis.com/youtube/v3/search"

api_key = "AIzaSyB7sfStkrXLwzxEBfFtGxcmCnfxra0OEmQ"
search_engine_id = "d3c4eae8e0bc44663"

# Google Custom Search API endpoint
url = "https://www.googleapis.com/customsearch/v1"

conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_chat_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
)


def summarize_history(messages, max_tokens=300):
    """Generate a concise summary from the chat history."""
    user_messages = [msg.content for msg in messages if isinstance(msg, HumanMessage)]
    if not user_messages:
        return ""
    summary = "Relevant context: " + " ".join(user_messages[-5:])
    return summary[:max_tokens]


# Function to create a retriever prompt
def construct_prompt(user_input):
    summary = summarize_history(st.session_state.chat_history.messages)
    return f"{summary}\nUser: {user_input}".strip()


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

def has_recipe(response):
    prompt = f"""
    Analyze this response and determine if it contains any Ayurvedic recipe or remedy instructions:
    {response}
    Return only 'true' if it contains a recipe/remedy, or 'false' if it doesn't.
    """
    result = llm.invoke(prompt).content.lower().strip()
    return result == 'true'

if user_input:
    with st.spinner("Processing your request..."):
        session_id = st.session_state.session_id
        response = conversational_rag_chain.invoke(
            {"input": user_input},
            config={"configurable": {"session_id": session_id}},
        )
        print(response["answer"])
        
        # Only fetch external links if a recipe is present
        if has_recipe(response["answer"]):
            # Get Google search results
            query = get_google_queries(response["answer"])
            params = {
                "key": api_key,
                "cx": search_engine_id,
                "q": query,
            }
            res = requests.get(url, params=params)
            results = res.json()
            top_links = [item["link"] for item in results.get("items", [])[:2]]
            print(top_links)
            
            # Get YouTube video suggestions
            youtube_query = get_youtube_videos(response["answer"])
            youtube_params = {
                "key": youtube_api_key,
                "part": "snippet",
                "q": youtube_query,
                "type": "video",
                "maxResults": 2
            }
            youtube_res = requests.get(youtube_url, params=youtube_params)
            youtube_results = youtube_res.json()
            
            # Extract video information
            if "items" in youtube_results:
                videos = [{
                    "title": item["snippet"]["title"],
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
                } for item in youtube_results["items"]]
                print(videos)
                # Display video suggestions in the sidebar
                with st.sidebar.expander("📺 Related Videos", expanded=True):
                    for video in videos:
                        st.markdown(f"[{video['title']}]({video['url']})")

        st.session_state.chat_history.add_message(HumanMessage(content=user_input))
        st.session_state.chat_history.add_message(AIMessage(content=response["answer"]))

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
