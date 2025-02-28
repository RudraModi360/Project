from setuptools import setup, find_packages

setup(
    name="localhost-server",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "pydantic",
        "python-dotenv",
        "langchain",
        "langchain-groq",
        "langchain-community",
        "langchain-core",
        "langchain-ollama",
        "faiss-cpu"
    ],
    author="Team Ayurnetra",
    author_email="ayurnetra@example.com",
    description="API for Ayurvedic health assistant chatbot",
    keywords="ayurveda,chatbot,health,api",
    python_requires=">=3.8"
)