import requests
from bs4 import BeautifulSoup
import textwrap
import numpy as np
import pandas as pd
import google.generativeai as genai

url = "https://www.facebook.com/"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# soup = soup.prettify()  # or soup.get_text() if you only need the text
# print(soup)
#buttons = soup.find_all(['button', 'div', 'span'], attrs={"role": "button"}) + soup.find_all(['div', 'iframe'])

buttons = soup.find_all(['button']) + soup.find_all(attrs={"role": "button"})

# Function to extract the most relevant label for a button
def get_button_label(button):
    # Try to get text within the button element
    if button.text.strip():
        return button.text.strip()
    # Try to get attributes like aria-label, alt
    for attr in ['aria-label', 'alt', 'title']:
        if button.has_attr(attr):
            return button[attr]
    # If no label found, return placeholder text
    return "Unnamed Button"

# Print the button names (or text content)
buttons = [get_button_label(button) for button in buttons]


api_key = "AIzaSyC-1VIMgO61lFnZdYpZ6AyHqwm6ZbFID4o"
genai.configure(api_key=api_key)

for m in genai.list_models():
  if 'embedContent' in m.supported_generation_methods:
    model = m
    break
    #print(m.name)

documents = []

for button in buttons:
   doc = {
        "title": f"Button: {button}",
        "content": button
   }
   documents.append(doc)

# html_document = {
#   "title": f"HTML FOR {url}",
#   "content": html_content
# }

df = pd.DataFrame(documents)
df.columns = ['Title', 'Text']


def embed_fn(title, text):
  return genai.embed_content(model=model,
                             content=text,
                             task_type="retrieval_document",
                             title=title)["embedding"]


df['Embeddings'] = df.apply(lambda row: embed_fn(row['Title'], row['Text']), axis=1)
print(df)


#QUERY WITH EACH STEP FROM GEMINI CALL

query = "Log into your Facebook account."
model = 'models/embedding-001'

request = genai.embed_content(model=model,
                              content=query,
                              task_type="retrieval_query")

def find_best_passage(query, dataframe):
  """
  Compute the distances between the query and each document in the dataframe
  using the dot product.
  """
  query_embedding = genai.embed_content(model=model,
                                        content=query,
                                        task_type="retrieval_query")
  dot_products = np.dot(np.stack(dataframe['Embeddings']), query_embedding["embedding"])
  idx = np.argmax(dot_products)
  return dataframe.iloc[idx]['Text'] # Return text from index with max value

passage = find_best_passage(query, df)
print(passage)