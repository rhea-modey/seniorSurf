# SeniorSurf — AI Navigation Assistant

SeniorSurf is a Chrome extension prototype designed to help older users navigate unfamiliar websites through natural-language requests.

The extension sends a user's request to a local Flask service backed by Gemini, generates step-by-step guidance, and explores embedding-based matching between user requests and interface controls. The project combines browser-extension development, LLM integration, and lightweight semantic matching in an accessibility-focused workflow.

## What it does

- Accepts natural-language navigation requests through a Chrome extension
- Connects the extension to a local Flask API
- Uses Gemini to generate navigation guidance
- Explores embedding-based matching between requests and page controls
- Tests a separate scraping/vector-search approach for ranking button labels by semantic similarity

## Architecture

```text
Chrome extension
    ↓
Natural-language request
    ↓
Flask service
    ↓
Gemini guidance generation
    ↓
Embedding-based control matching
    ↓
Step-by-step navigation guidance
```

## Tech

JavaScript · Chrome Extensions API · Python · Flask · Gemini · Embeddings · Beautiful Soup · NumPy · Pandas

## Current scope

SeniorSurf is an exploratory prototype rather than a production browser agent. The current extension uses a predefined set of example website controls for its main interaction flow rather than dynamically discovering every actionable element on arbitrary pages.

`vector.py` separately experiments with scraping button labels from a page and ranking them by embedding similarity. That experiment is not yet connected to the extension's live navigation flow.

## Local setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install flask flask-cors google-generativeai beautifulsoup4 numpy pandas requests
export GEMINI_API_KEY="your-key-here"
python geminiAPI.py
```

Load the unpacked extension in Chrome. The background script calls the local Flask service at `http://localhost:5001/`; embedding requests use `/embed`.

## Next steps

- Discover actionable controls directly from the current page DOM
- Connect live DOM discovery to the embedding-matching pipeline
- Support more robust multi-step navigation plans
- Add voice input and additional accessibility settings
