# AyuHelper - An Ayurvedic Chatbot

## Overview
AyuHelper is an AI-powered chatbot designed to provide Ayurvedic guidance for common health issues. It offers personalized home remedies based on Ayurvedic principles while maintaining a caring, humble, and conversational tone. The chatbot adapts its responses using a RAG (Retrieval-Augmented Generation) system and tracks user interactions for context-aware conversations.

## Features
- **Conversational Flow:** The chatbot follows a structured interaction, starting with understanding the user's body type (Dosha) and medical history.
- **Retrieval-Augmented Generation (RAG):** Combines document retrieval with real-time AI responses.
- **Session Management:** Supports multiple chat sessions with history tracking and session resets.
- **Contextual Memory:** Retains user data like Dosha type and health issues to personalize responses.
- **Streamlit Integration:** Clean and user-friendly chat interface powered by Streamlit.

## Setup

### Prerequisites
Ensure you have the following installed:
- Python 3.8 or higher
- Streamlit
- LangChain
- LangChain Community Libraries (Groq, Ollama, FAISS)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/RudraModi360/Project.git
   cd Project
   ```
2. Install dependencies and local package:
   ```bash
   pip install -r requirements.txt
   pip install -e .
   ```

   This will install all required dependencies and the local package in development mode.

### Environment Variables
Configure the following environment variables in a `.env` file or your local environment:
```
LANGCHAIN_TRACING=true
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
LANGCHAIN_API_KEY=your_langchain_api_key
LANGCHAIN_PROJECT=Streamlit-Ayu
GROQ_API_KEY=your_groq_api_key
```

## Usage

### Running the Backend Server
Start the FastAPI backend server:
```bash
uvicorn LocalHost_Server.main:app --reload
```

### Running the Frontend
Start the Streamlit app by running:
```bash
streamlit run Streamlit_page.py
```

### Chat Interface
- **Ask Questions:** Use the input box to ask about health concerns.
- **Session History:** View past conversations in the sidebar.
- **Start New Session:** Use the sidebar button to reset chat history and start a new session.

## Structure
- `llm`: Configures the Groq model (Llama 3.2 90B vision preview).
- `vector_db`: Uses FAISS for efficient similarity search.
- `conversational_rag_chain`: Combines retrieval and AI response generation.
- `get_chat_session_history`: Handles session-specific chat history.
- `start_new_session`: Resets sessions and stores old ones.

## Customization
- **Modify prompts:** Adjust the Ayurvedic guidelines and flow in the `with_memory_prompt` and `retriever_prompt` sections.
- **Fine-tune RAG:** Update the FAISS vector store or use another embedding model.
