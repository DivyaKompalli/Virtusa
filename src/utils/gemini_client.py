import os
import logging
import re
import html

try:
    import google.generativeai as genai
except ImportError:
    genai = None

from .load_gemini_env import load

logger = logging.getLogger(__name__)

def get_gemini_response(prompt: str) -> str:
    """
    Generates a response using the Gemini API, falling back to a rule-based
    approach if the API key is missing, invalid, or the API call fails.
    """
    # Ensure environment variables are loaded
    load()
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key or not genai:
        logger.warning("GEMINI_API_KEY not set or google-generativeai not installed. Using fallback.")
        return get_fallback_response(prompt)

    try:
        genai.configure(api_key=api_key)
        # Using the current standard model for text generation
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        if response.parts:
            # Strip any potential HTML tags from the response text for a clean output.
            unescaped_text = html.unescape(response.text)
            clean_text = re.sub(r'<[^>]+>', '', unescaped_text)
            return clean_text.strip()
        else:
            logger.warning("Gemini API returned no content or was blocked. Using fallback.")
            return get_fallback_response(prompt)

    except Exception as e:
        logger.error(f"Error communicating with Gemini API: {e}. Using fallback.")
        return get_fallback_response(prompt)

def get_fallback_response(prompt: str) -> str:
    """
    Rule-based fallback mechanism for when the AI service is unavailable.
    """
    prompt_lower = prompt.lower()

    if "hello" in prompt_lower or "hi" in prompt_lower:
        return "Hello! I am operating in a limited, rule-based mode right now. How can I assist you with basic queries?"
    elif "help" in prompt_lower:
        return "I am currently in fallback mode without API access. I can answer simple, predefined queries."
    else:
        return "I'm currently unable to process complex requests due to missing or invalid API configuration. Please check the system logs."