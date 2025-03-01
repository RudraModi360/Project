import os
from supabase import create_client, Client

url: str = "https://nsaylbnbmzsbmdrdnoor.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYXlsYm5ibXpzYm1kcmRub29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDUyNjQsImV4cCI6MjA1NjM4MTI2NH0.mNgji9RAVNgz9a-SkEm8wmvF9oAwqoyG4rtXeodS008"
supabase: Client = create_client(url, key)

def fetch_data(user_id):
    response = (supabase.table("chatbot").select("*").execute())
    records=[]
    if response.data:  
        for dict in response.data:
            if dict["user_id"]==user_id:
                records.append(dict)
    else:
        return f"No data found in table"

def insert_into_table(user_id,message,response):
    output = (supabase.table("chatbot").insert({"user_id": user_id,"message": message,"response":response}).execute()
)
    return output