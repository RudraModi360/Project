from googlesearch import search
from LocalHost_Server.models import get_llm
import re
from requests import request

llm = get_llm()


def fetch_top_search_results(query, num_results=10):
    search_results = search(query, num_results=num_results)
    return search_results


def get_google_article_queries(response: str, llm) -> str:
    prompt = f"""
    Analyze the given response: {response}.
    Identify any Ayurvedic recipe or remedy mentioned.
    Create a focused search query to find articles or blogs about this remedy.
    Ensure the query uses keywords like 'Ayurvedic recipe', 'Ayurvedic remedy', and 'herbal treatment'.
    Only return the search query without extra explanations.
    """
    return llm.invoke(prompt).content


def fetch_article_links(response: str, llm, num_results=10):
    query = get_google_article_queries(response, llm)
    try:
        return list(fetch_top_search_results(query, num_results=num_results))
    except Exception as e:
        print(f"Error fetching article links: {str(e)}")
        return []


def get_youtube_videos(response: str, llm) -> str:
    prompt = f"""
    Analyze the given response: {response}.
    If there are any Ayurvedic remedies or treatments mentioned, create a focused YouTube search query to find relevant tutorial videos.
    Only return the search query without extra explanations.
    """
    return llm.invoke(prompt).content


def fetch_youtube_links(response: str, llm, num_results=10):
    query = get_youtube_videos(response, llm)
    url = f"https://www.youtube.com/results?search_query={query}"
    response = request("get", url)
    video_links = re.findall(r'\"url\":\"(/watch\?v=[^"]+)', response.text)
    # Format the URLs
    full_links = [f"https://www.youtube.com{link}" for link in video_links]
    try:
        return full_links[:3]
    except Exception as e:
        print(f"Error fetching article links: {str(e)}")
        return []
