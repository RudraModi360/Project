from langchain_groq import ChatGroq
import os
from langchain_ollama import OllamaEmbeddings


def get_embedding_model():
    # Use a default model name or allow override through environment variable
    model_name = os.getenv("EMBEDDING_MODEL", "nomic-embed-text:latest")
    return OllamaEmbeddings(model=model_name)

def get_llm(model_name=None, groq_api_key=None):
    # Use environment variables as fallback
    api_key = groq_api_key or os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY must be provided either as an argument or in environment variables")
    
    model = model_name or os.getenv("GROQ_MODEL", "llama-3.3-70b-specdec")
    temperature = float(os.getenv("GROQ_TEMPERATURE", "0.7"))
    
    return ChatGroq(
        api_key=api_key,
        model=model,
        temperature=temperature,
    )
