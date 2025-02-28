from langchain_groq import ChatGroq
import os
from langchain_cohere import CohereEmbeddings
try:
    from langchain_ollama import OllamaEmbeddings
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False


def get_embedding_model():
    # Try to use Ollama if available, otherwise fallback to Cohere
    if OLLAMA_AVAILABLE:
        model_name = os.getenv("EMBEDDING_MODEL", "nomic-embed-text:latest")
        try:
            # Try to initialize the model to check if it exists
            embeddings = OllamaEmbeddings(model=model_name)
            # Test the model by embedding a simple string
            embeddings.embed_query("test")
            return embeddings
        except Exception as e:
            if "model not found" in str(e).lower():
                print(f"\nOllama model '{model_name}' is not available.")
                print(f"Please run 'ollama pull {model_name}' to download the model.")
                user_input = input("Would you like to download the model now? (y/n): ")
                if user_input.lower() == 'y':
                    import subprocess
                    try:
                        subprocess.run(["ollama", "pull", model_name], check=True)
                        return OllamaEmbeddings(model=model_name)
                    except subprocess.CalledProcessError:
                        print("Failed to download the model. Falling back to Cohere embeddings.")
                else:
                    print("Falling back to Cohere embeddings.")
            else:
                print(f"Error initializing Ollama embeddings: {e}")
                print("Falling back to Cohere embeddings.")
    
    # Fallback to Cohere
    cohere_api_key = os.getenv("COHERE_API_KEY")
    if not cohere_api_key:
        raise ValueError("COHERE_API_KEY must be provided in environment variables when Ollama is not available")
    return CohereEmbeddings(cohere_api_key=cohere_api_key)

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
