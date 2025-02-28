from LocalHost_Server.vectordb_loader import get_vector_db
from langchain.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain.chains import create_history_aware_retriever
from LocalHost_Server.models import get_llm
import os

vector_db = get_vector_db()
llm = get_llm("llama-3.3-70b-specdec", os.getenv("GROQ_API_KEY"))
retriever = vector_db.as_retriever()

retriever_prompt = "Based on the provided chat history and the user's latest question — which may reference prior context — rephrase the question into a self-contained query that is clear without relying on the chat history. Do not answer the question; simply reformulate it if necessary, or return it unchanged."

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
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

context_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", retriever_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
    ]
)


def get_rag_chain():
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, context_prompt
    )
    history_chain = create_stuff_documents_chain(llm, with_memory_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, history_chain)
    return rag_chain
