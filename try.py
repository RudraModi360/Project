# from langchain_cohere import CohereEmbeddings
# import os
# from LocalHost_Server.vectordb_loader import get_vector_db

# # cohere_api_key = os.getenv("COHERE_API_KEY")
# # if not cohere_api_key:
# #     raise ValueError("COHERE_API_KEY is missing")
# vector_db=get_vector_db()
# # embeddings = CohereEmbeddings(cohere_api_key=cohere_api_key, model="embed-english-v3.0")
# # print(embeddings.embed_query("Hello world"))
# print("FAISS index dimension (d):", vector_db.index.d)

# # Get a test query embedding
# from LocalHost_Server.models import get_llm
# llm = get_llm("llama-3.3-70b-specdec", os.getenv("GROQ_API_KEY"))

# cohere_api_key = os.getenv("COHERE_API_KEY")
# embeddings = CohereEmbeddings(model="embed-multilingual-v2.0", cohere_api_key=cohere_api_key)

# query_vector = embeddings.embed_query("test query")
# print("Query vector dimension:", len(query_vector))
# from googlesearch import search

# def fetch_top_search_results(query, num_results=10):
#     search_results = search(query, num_results=num_results)
#     return search_results

# ans=fetch_top_search_results("india")
# for an in ans:
#     print(an)

import re
from requests import request

# Send a GET request to YouTube search page
response = request("get", "https://www.youtube.com/results?search_query=hi")

# Extract video URLs using regex (basic pattern for YouTube video links)
video_links = re.findall(r'\"url\":\"(/watch\?v=[^"]+)', response.text)

# Format the URLs
full_links = [f"https://www.youtube.com{link}" for link in video_links]

# Remove duplicates and print
print(full_links[:3])
