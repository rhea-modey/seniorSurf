# SeniorSurf — AI Navigation Assistant prototype

SeniorSurf explores natural-language guidance for people navigating unfamiliar websites. The Chrome extension sends a user's request to a local Flask service backed by Gemini, and its background script matches returned steps against a small predefined set of interface elements using embeddings.

This is a prototype. The extension currently seeds example Facebook controls rather than discovering actionable elements across arbitrary live pages. `vector.py` separately experiments with scraping button labels and ranking them by embedding similarity; it is not connected to the extension's live flow.

## Tech

JavaScript, Chrome Extensions API, Python, Flask, Gemini embeddings, Beautiful Soup.

## Local setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install flask flask-cors google-generativeai beautifulsoup4 numpy pandas requests
export GEMINI_API_KEY="your-key-here"
python geminiAPI.py
```

Load the unpacked extension in Chrome to try the prototype. The background script calls the local Flask service at `http://localhost:5001/`; embedding requests use `/embed`. Do not put an API key in the extension or commit one to the repository.

## Next steps

- Discover actionable controls from the current page's DOM.
- Support multi-step plans and robust selection of controls.
- Add voice input and accessibility settings.
