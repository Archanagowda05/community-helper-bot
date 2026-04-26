"""
main.py — FastAPI server for Community AI Assistant.
"""
import os

# Load .env automatically
try:
    from dotenv import load_dotenv as _load_dotenv
    _script_dir = os.path.dirname(os.path.abspath(__file__))
    for _ep in [os.path.join(_script_dir, ".env"), os.path.join(os.path.dirname(_script_dir), ".env")]:
        if os.path.exists(_ep):
            _load_dotenv(_ep)
            print(f"Loaded .env from {_ep}")
            break
except ImportError:
    pass

from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from kb import get_context, load_kb

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", os.getenv("LLM_API_KEY", ""))
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.mistral.ai/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "mistral-small-latest")

SYSTEM_PROMPT = """You are the TechNexus Support Assistant — friendly, warm, and professional.

STRICT RULES:
1. GREETINGS (hi/hello/hey/okay/lol — single casual words with NO question): Reply with ONE short warm line. No "Hey! 👋" if the user asked a real question. Never start a factual answer with a greeting.
2. FACTUAL QUESTIONS: Answer directly using ONLY the context below. Do NOT prepend "Hey! 👋" or any greeting. Just answer.
3. Keep answers SHORT (2-4 sentences). Use bullet points only when listing 3+ items.
4. Off-topic questions: Gently redirect without saying "outside my area". Vary your redirects.
5. NEVER hallucinate. NEVER repeat the same redirect twice in a row.
6. Never mention "context", "knowledge base", or "documents".

UPCOMING EVENT RULE (CRITICAL):
- For "upcoming", "next", "future", "latest" event questions: find the "## Upcoming Event" section in context and return its FULL details (name, date, location, time, description) as bullet points.
- NEVER use events from "Previous Events", "Other Past Events", or "Major Event Series" as the upcoming event.
- Past events include: NexusAI Chennai, AI Native Meetup, GitHub Copilot Dev Day. Never call these "upcoming".

LINKS RULE:
- If asked for links, social media, or how to connect: provide the actual TechNexus links:
  - LinkedIn: https://www.linkedin.com/company/technexuscommunity/
  - Meetup: https://www.meetup.com/technexus-community/
  - Instagram: https://www.instagram.com/technexus.community/
  - YouTube: https://www.youtube.com/@TechNexus_Community

Context:
{context}"""

NO_CONTEXT_RESPONSE = "I'm not sure about that one, but I'd love to help with anything TechNexus-related — events, community info, how to join, and more! 😊"

app = FastAPI(title="Community AI Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    sources: List[str] = []


@app.on_event("startup")
async def startup():
    load_kb()


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    query = request.message.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    context = get_context(query, top_k=3, min_score=0.15)

    if not context:
        return ChatResponse(reply=NO_CONTEXT_RESPONSE, sources=[])

    system_message = SYSTEM_PROMPT.format(context=context)

    if not MISTRAL_API_KEY:
        # Clean fallback when no API key
        lines = [l for l in context.split("\n") if not l.startswith("[Section:")]
        return ChatResponse(reply="\n".join(lines).strip(), sources=[])

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{LLM_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {MISTRAL_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": LLM_MODEL,
                    "messages": [
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": query},
                    ],
                    "temperature": 0.3,
                    "max_tokens": 512,
                },
            )
            response.raise_for_status()
            data = response.json()
            reply = data["choices"][0]["message"]["content"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM request failed: {str(e)}")

    sources = list({
        line.split("]")[0].replace("[Section: ", "")
        for line in context.split("\n")
        if line.startswith("[Section:")
    })

    return ChatResponse(reply=reply, sources=sources)


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)