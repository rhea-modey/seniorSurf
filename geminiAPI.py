"""
Install the Google AI Python SDK

$ pip install google-generativeai

See the getting started guide for more information:
https://ai.google.dev/gemini-api/docs/get-started/python
"""
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
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
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
to a single action on the webpage like clicking a button or typing in a search bar. Make sure each step specifies exactly what buttons or actions to make and are not general. Provide details for every single action. Provide concise steps in a
numbered list. Ensure every step includes the element of the webpage that the user should interact with.

Example:
Query: How can I send a friend request to Bob on Facebook?
Your Output:
1. Enter your username address and password to log into your Facebook account.
2. Search for Bob in the search bar.
3. Click on Bob's profile.
4. Click on the 'Add Friend' button.
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

# chat_session = model.start_chat(
#   history=[
#     # {
#     #   "role": "user",
#     #   "parts": [
#     #     "What are some investment suggestions you would make for me as a woman to set me up for the future, include information why i should as well, also include information about like investing in index funds or high yield savings account as like examples and propose their benefits",
#     #   ],
#     # },
#     # {
#     #   "role": "model",
#     #   "parts": [
#     #     "It's fantastic that you're thinking about your financial future! Investing is a powerful tool for women of all ages to build wealth and achieve their goals. Here are some suggestions, along with explanations and examples:\n\n**1.  Emergency Fund:**\n\n* **Why:** This is your safety net. It protects you from unexpected expenses like medical bills, car repairs, or job loss.  Without one, you could be forced to sell assets or go into debt.\n* **How:** Aim for 3-6 months of living expenses in a high-yield savings account. This offers a higher interest rate than traditional savings accounts.\n\n**2.  Retirement Savings:**\n\n* **Why:** Retirement is a long way off, but the earlier you start saving, the more time your money has to grow. The power of compounding works in your favor.\n* **How:** \n    * **401(k) or 403(b):**  If your employer offers a retirement plan, contribute enough to get the full employer match. This is free money!\n    * **Individual Retirement Account (IRA):** If you don't have an employer plan, a traditional IRA or Roth IRA is a great option.  A Roth IRA allows your earnings to grow tax-free.\n\n**3.  Index Funds:**\n\n* **Why:** Index funds are a low-cost way to invest in the stock market. They track a specific market index (like the S&P 500) and provide broad diversification, reducing risk.\n* **How:** Choose a low-cost index fund that tracks a broad market index and invest regularly.  This is a long-term investment strategy.\n\n**4.  Real Estate:**\n\n* **Why:** Real estate can be a solid investment, generating income through rent and appreciating in value over time.\n* **How:** \n    * **Rental Property:** Consider buying a rental property if you have the capital and are comfortable with the responsibilities of being a landlord.\n    * **Real Estate Investment Trusts (REITs):** REITs offer a more passive way to invest in real estate through publicly traded companies.\n\n**5.  High-Yield Savings Account:**\n\n* **Why:** While not an investment in the traditional sense, a high-yield savings account offers a better return than a standard savings account. It's a good place to park your emergency fund.\n* **How:**  Shop around for online banks and credit unions that offer higher interest rates on their savings accounts.\n\n**Important Considerations:**\n\n* **Diversification:** Don't put all your eggs in one basket. Spread your investments across different asset classes (stocks, bonds, real estate) to reduce risk.\n* **Risk Tolerance:** Be realistic about your risk tolerance. Are you comfortable with the ups and downs of the stock market, or do you prefer a more conservative approach?\n* **Financial Planning:** Consult with a financial advisor who can help you create a personalized investment plan that meets your goals and risk tolerance.\n\n**Remember:** Investing is a marathon, not a sprint. Stay disciplined, invest regularly, and don't be afraid to seek professional advice when needed. \n",
#     #   ],
#     # },
#     {
#       "role": "user",
#       "parts": [
#         """
#         You are an agent that specializes in helping the elderly in navigating webpages. You will be asked queries on how to
#         navigate webpages. Your task is to break down the task into clear and concise actions. Each step should correspond
#         to a single action on the webpage like clicking a button or typing in a search bar. Make sure each step specifies exactly what buttons or actions to make and are not general. Provide details for every single action. Provide concise steps in a
#         numbered list. Ensure every step includes the element of the webpage that the user should interact with.

#         Example:
#         Query: How can I send a friend request to Bob on Facebook?
#         Your Output:
#         1. Enter your username address and password to log into your Facebook account.
#         2. Search for Bob in the search bar.
#         3. Click on Bob's profile.
#         4. Click on the 'Add Friend' button.
#         """
#       ],
#     }
#   ]
# )

# #response = chat_session.send_message("How do I create a post on Facebook")

# #print(response.text)
# #print(chat_session.history)
