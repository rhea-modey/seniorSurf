from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure Gemini from an environment variable. Never commit API keys.
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not set")
genai.configure(api_key=api_key)

generation_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 200,
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
You are an agent that specializes in helping elderly users navigate webpages.
Break each task into clear, concise actions. Each step should correspond to a
single webpage action such as clicking a button or entering text. Name the
specific interface element whenever possible and avoid unnecessary explanation.
"""

chat_session = model.start_chat(history=[
    {"role": "user", "parts": [system_prompt]},
    {"role": "model", "parts": ["Understood."]},
])

@app.route("/embed", methods=["POST"])
def embed():
    text = (request.get_json(silent=True) or {}).get("text")
    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "No text provided"}), 400
    result = genai.embed_content(
        model="models/embedding-001",
        content=text,
        task_type="retrieval_document",
    )
    return jsonify({"embedding": result["embedding"]})

@app.route("/", methods=["GET"])
def hello_world():
    return jsonify({"response": "Hello World"})

@app.route("/", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    response = chat_session.send_message(user_message)
    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
