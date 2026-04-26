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

SYSTEM_PROMPT = """You are the TechNexus Support Assistant. You are friendly, warm, polite, and slightly cheerful but professional.

RULES:
1. For greetings and casual messages (hi, hello, hey, okay, lol, etc.): Respond warmly and naturally like a human friend. Do NOT mention limitations. Example: "Hey! 👋 How can I help you with TechNexus today?"
2. For TechNexus-related questions: Answer using ONLY the provided context. Keep answers SHORT (2-3 sentences max). Be concise and direct. Use bullet points only when listing 3+ items.
3. For questions NOT related to TechNexus: Respond politely and conversationally — acknowledge the topic briefly, then gently redirect. NEVER say "outside my area" or "I can't help with that."
4. NEVER guess or use external knowledge. NEVER hallucinate facts.
5. NEVER repeat the same fallback or redirection sentence twice in a row.
6. Do not mention "context", "knowledge base", or "documents" — answer naturally.
7. The user should NEVER feel ignored or rejected.
8. UPCOMING EVENT RULE (CRITICAL):
   - When the user asks about the "upcoming", "next", "future", or "latest" event, you MUST look for the section explicitly labelled "Upcoming Event" in the context.
   - Return its FULL details: event name, date, location, time, and description. Use bullet points.
   - The "Upcoming Event" section is ALWAYS the correct answer — do NOT use any event listed under "Previous Events", "Other Past Events", or "Major Event Series".
   - Events like "NexusAI Chennai", "AI Native Meetup", "GitHub Copilot Dev Day" are PAST events. Never present them as upcoming.
   - Trust the "## Upcoming Event" heading above all else.

Context:
{context}"""

NO_CONTEXT_RESPONSE = "Hey there! 😊 I'm not sure about that one, but I'd love to help you with anything TechNexus-related — events, community info, how to join, and more!"

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
        # Clean fallback: extract just the upcoming event text instead of raw dump
        lines = []
        for line in context.split("\n"):
            if line.startswith("[Section:"):
                continue
            lines.append(line)
        clean = "\n".join(lines).strip()
        return ChatResponse(reply=clean, sources=[])

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