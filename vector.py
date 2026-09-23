import os
import requests
from bs4 import BeautifulSoup
import numpy as np
import pandas as pd
import google.generativeai as genai

url = "https://www.facebook.com/"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

buttons = soup.find_all(["button"]) + soup.find_all(attrs={"role": "button"})

def get_button_label(button):
    if button.text.strip():
        return button.text.strip()
    for attr in ["aria-label", "alt", "title"]:
        if button.has_attr(attr):
            return button[attr]
    return "Unnamed Button"

buttons = [get_button_label(button) for button in buttons]

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not set")
genai.configure(api_key=api_key)

for m in genai.list_models():
    if "embedContent" in m.supported_generation_methods:
        embedding_model = m
        break
else:
    raise RuntimeError("No Gemini embedding model is available")

documents = [{"title": f"Button: {button}", "content": button} for button in buttons]

df = pd.DataFrame(documents)
df.columns = ["Title", "Text"]

def embed_fn(title, text):
    return genai.embed_content(
        model=embedding_model,
        content=text,
        task_type="retrieval_document",
        title=title,
    )["embedding"]

df["Embeddings"] = df.apply(lambda row: embed_fn(row["Title"], row["Text"]), axis=1)

query = "Log into your Facebook account."
query_model = "models/embedding-001"

def find_best_passage(query, dataframe):
    query_embedding = genai.embed_content(
        model=query_model,
        content=query,
        task_type="retrieval_query",
    )
    dot_products = np.dot(
        np.stack(dataframe["Embeddings"]),
        query_embedding["embedding"],
    )
    idx = np.argmax(dot_products)
    return dataframe.iloc[idx]["Text"]

passage = find_best_passage(query, df)
print(passage)
