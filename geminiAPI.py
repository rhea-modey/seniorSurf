from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes by default

# Configure your Gemini API Key
api_key = "AIzaSyC-1VIMgO61lFnZdYpZ6AyHqwm6ZbFID4o"
genai.configure(api_key=api_key)

# Setup the model and session
generation_config = {
    "temperature": 0.5,  # Lower temperature for more predictable output
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 200,  # Reduced token limit for more concise responses
    "response_mime_type": "text/plain",
}
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-latest",
    safety_settings=safety_settings,
    generation_config=generation_config,
)

system_prompt = """
You are an agent that specializes in helping the elderly in navigating webpages. You will be asked queries on how to
navigate webpages. Your task is to break down the task into clear and concise actions. Each step should correspond
to a single action on the webpage like clicking a button or typing in a search bar. Ensure each step specifies exactly what buttons or actions to make. Provide a concise list of steps. Avoid lengthy explanations. Each step should include the element of the webpage that the user should interact with.

Example:
Query: How can I send a friend request to Bob on Facebook?
Your Output:
1. Enter your username and password to log into your Facebook account.
2. Search for Bob in the search bar at the top of the page.
3. Click on Bob's profile from the search results.
4. Click on the 'Add Friend' button on Bob's profile page.
"""

chat_session = model.start_chat(history=[
    {"role": "user", "parts": [system_prompt]},
    {"role": "model", "parts": ["Understood."]}
])


@app.route('/', methods=['GET'])
def hello_world():
    return jsonify({'response': "Hello World"})

@app.route('/', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # Send message to Gemini and get response
    response = chat_session.send_message(user_message)
    return jsonify({'response': response.text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
