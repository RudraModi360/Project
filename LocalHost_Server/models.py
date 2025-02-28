from langchain_groq import ChatGroq
import os
from langchain_cohere import CohereEmbeddings

def get_embedding_model():
    cohere_api_key = os.getenv("COHERE_API_KEY")
    print(cohere_api_key)
    if not cohere_api_key:
        raise ValueError("COHERE_API_KEY must be provided in environment variables")
    return CohereEmbeddings(cohere_api_key=cohere_api_key, model="embed-english-v3.0")

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
