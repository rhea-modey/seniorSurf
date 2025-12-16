# AI Agent Navigation Assistant

An AI-powered Chrome browser extension that helps elderly users navigate complex websites by translating natural-language intent into guided, step-by-step UI actions. The system uses vector embeddings and large language models to identify and highlight the most relevant interface elements on a webpage in real time.

## Problem
Many modern websites are difficult to navigate for elderly or less tech-savvy users due to dense layouts, inconsistent UI patterns, and unclear affordances. Small usability barriers often prevent users from completing simple tasks.

## Solution
This project introduces an AI agent that:
1. Interprets user intent expressed in natural language.
2. Embeds and indexes actionable UI elements (e.g., buttons, links) from a webpage’s HTML.
3. Matches user queries to a logical sequence of actions using vector similarity.
4. Highlights the most relevant UI elements directly in the browser to guide task completion.

The result is an assistive navigation layer that works on existing websites without requiring backend integration.

## System Overview
- Extracts button and interactive element text from the live DOM.
- Generates vector embeddings for UI elements.
- Processes user intent using the Google Gemini API.
- Ranks and selects relevant actions via embedding similarity.
- Visually highlights recommended UI elements in real time.

## Tech Stack
- **JavaScript** – Chrome extension logic  
- **Google Gemini API** – Natural language understanding  
- **Vector Embeddings** – Semantic matching between intent and UI elements  
- **HTML / DOM Parsing** – UI element extraction  
- **Chrome Extensions API** – Browser integration  

# Packages/Dependencies Required
Our extension is running on a virtual environment.
1. Python version 3+
2. Flask library
3. Flask-cors library
4. Google-GenerativeAI

## Key Features
- Natural language task input (e.g., “schedule a doctor’s appointment”)
- Real-time UI element discovery and highlighting
- No website-specific customization required
- Lightweight, privacy-conscious client-side execution

## Impact
By mapping intent directly to actionable UI elements, this system reduces cognitive load and improves accessibility for elderly users, demonstrating how GenAI can be applied to human-centered interface navigation.

## Future Work
- Multi-step task planning and action sequencing  
- Voice input for hands-free interaction  
- Personalization based on user behavior  
- Expanded accessibility features (contrast, text size, tooltips)
