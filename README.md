# Ayunetra - Your AI-Powered Ayurvedic Health Assistant 🌿

## Overview

Ayunetra is an AI-driven health assistant that combines Ayurvedic wisdom with modern AI technology to provide personalized recommendations for common day-to-day health concerns. It helps users manage and find relief from various ailments such as cough, fever, sneezing, acidity, and more, all while maintaining a conversational, empathetic tone.

## Features 🌟

- **Personalized Ayurvedic Recommendations:** Tailored advice based on your specific symptoms and body type (Dosha).
- **Common Ailment Support:** Guidance for daily health issues including:
  - Fever
  - Cough
  - Sneezing
  - Acidity
  - And many more
- **Conversational Flow:** Follows a doctor-patient style interaction, starting by understanding your body nature and health history.
- **RAG-based AI:** Combines document retrieval with real-time AI responses to give accurate and personalized suggestions.
- **Contextual Memory:** Remembers user inputs like Dosha type and symptoms for better follow-up advice.
- **User-Friendly Interface:** Clean and intuitive chat interface powered by Streamlit.
- **24/7 Availability:** Access Ayurvedic health recommendations anytime, anywhere.

## Important Note ⚠️

Ayunetra is designed to provide general guidance for non-severe health conditions. It is not a substitute for professional medical advice. Always consult a healthcare provider for serious medical conditions.

## Technology Stack 💻

- **FastAPI:** Backend framework for AI-powered responses.
- **Streamlit:** Frontend for chat interface.
- **LangChain:** Used for RAG-based retrieval and AI interaction.
- **FAISS:** Vector database for efficient document similarity search.
- **Python 3.8+**

## Setup 🚀

### Prerequisites

Ensure you have the following installed:
- Python 3.8 or higher
- Streamlit
- LangChain
- FAISS

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

### Environment Variables

Create a `.env` file and configure the following environment variables:
```
LANGCHAIN_TRACING=true
LANGCHAIN_PROJECT=Streamlit-Ayu
```

## Usage

### Running Locally

#### Backend Server
Start the FastAPI backend server:
```bash
uvicorn LocalHost_Server.main:app --reload
```

#### Frontend
Start the Streamlit app by running:
```bash
streamlit run Streamlit_page.py
```

### Chat Interface
- **Ask Questions:** Use the input box to ask about health concerns.
- **Session History:** View past conversations in the sidebar.
- **Start New Session:** Use the sidebar button to reset chat history and start a new session.

## API Endpoints

#### 1. Root Endpoint
- **URL:** `/`
- **Method:** `GET`
- **Description:** Welcome message endpoint
- **Response:**
  ```json
  {
    "message": "Welcome to AyuHelper API"
  }
  ```

#### 2. Chat Endpoint
- **URL:** `/chat`
- **Method:** `POST`
- **Description:** Process user queries and return Ayurvedic responses
- **Request Body:**
  ```json
  {
    "message": "string",
    "user_id": "string" (optional)
  }
  ```
- **Response:**
  ```json
  {
    "answer": "string",
    "user_id": "string",
    "google_links": ["string"],
    "youtube_videos": ["string"]
  }
  ```

#### 3. New User Endpoint
- **URL:** `/new_user`
- **Method:** `POST`
- **Description:** Create a new user session
- **Response:**
  ```json
  {
    "user_id": "string",
    "message": "string"
  }
  ```

#### 4. User History Endpoint
- **URL:** `/users/{user_id}/history`
- **Method:** `GET`
- **Description:** Retrieve chat history for a specific user
- **Response:**
  ```json
  {
    "history": [
      {
        "role": "user|assistant",
        "content": "string"
      }
    ]
  }
  ```

## Demo 🎥

Watch the Ayunetra demo video here: [Ayunetra Demo](https://drive.google.com/drive/folders/1CmUzAXVZJQvKz7vcVYPcnO3jnfHYke_j?usp=sharing)

## Contributing 🤝

We welcome contributions to Ayunetra! Please feel free to submit issues and pull requests.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact 📧

For any queries or suggestions, please reach out to us.

---

Built with ❤️ for better health assistance.

