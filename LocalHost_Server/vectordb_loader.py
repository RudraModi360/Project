import os
from pathlib import Path
from langchain_community.vectorstores import FAISS
from LocalHost_Server.models import get_embedding_model


def get_vector_db():
    # Get the project root directory (parent of LocalHost_Server)
    project_root = Path(__file__).parent.parent
    db_path = os.path.join(project_root, "DB")
    
    return FAISS.load_local(
        db_path,
        embeddings=get_embedding_model(),
        allow_dangerous_deserialization=True,
    )

