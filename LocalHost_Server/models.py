from langchain_groq import ChatGroq
import os
from langchain_cohere import CohereEmbeddings
from langchain_ollama import OllamaEmbeddings

def get_embedding_model():
    cohere_api_key = os.getenv("COHERE_API_KEY")
    embeddings = CohereEmbeddings(cohere_api_key=cohere_api_key, model="embed-multilingual-v2.0")
    #         # Test the embeddings with a simple query
    #         embeddings.embed_query("test")
    return embeddings
    #     except Exception as cohere_error:
    #         print(f"Warning: Cohere embeddings failed: {str(cohere_error)}")
    #         return OllamaEmbeddings(model="nomic-embed-text:latest")
            
    # except Exception as e:
    #     print(f"Critical error in embedding initialization: {str(e)}")
    #     raise RuntimeError(f"Failed to initialize any embedding model: {str(e)}")

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