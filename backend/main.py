"""
main.py — FastAPI server for Community AI Assistant.

Usage:
    1. Build the knowledge base first:
       python build_kb.py

    2. Set your API key (choose one):
       export MISTRAL_API_KEY=your_key_here
       # OR for OpenAI-compatible endpoints:
       export LLM_API_KEY=your_key_here
       export LLM_BASE_URL=https://api.mistral.ai/v1

    3. Start the server:
       pip install fastapi uvicorn httpx sentence-transformers faiss-cpu
       uvicorn main:app --host 0.0.0.0 --port 8000 --reload

    4. API endpoint:
       POST /chat  { "message": "What are the community rules?" }
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from kb import get_context, load_kb

# --- Configuration ---
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", os.getenv("LLM_API_KEY", ""))
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.mistral.ai/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "mistral-small-latest")

SYSTEM_PROMPT = """You are the TechNexus Support Assistant. You are friendly, warm, polite, and slightly cheerful but professional.

RULES:
1. For greetings and casual messages (hi, hello, hey, okay, lol, etc.): Respond warmly and naturally like a human friend. Do NOT mention limitations. Example: "Hey! 👋 How can I help you with TechNexus today?"
2. For TechNexus-related questions: Answer using ONLY the provided context. Keep answers SHORT (2-3 sentences max). Be concise and direct. Use bullet points only when listing 3+ items.
3. For questions NOT related to TechNexus: Respond politely and conversationally — acknowledge the topic briefly, then gently redirect. NEVER say "outside my area" or "I can't help with that." Vary your responses. Examples:
   - "That's a cool topic 😄 I'm here to help with TechNexus events and community info though! Anything you'd like to know?"
   - "Haha, I wish I knew more about that! 😊 But hey, want to hear about what's happening at TechNexus?"
   - "Great question! Not quite my thing though — I'm all about TechNexus. Ask me about events, roles, or how to join!"
4. NEVER guess or use external knowledge. NEVER hallucinate facts.
5. NEVER repeat the same fallback or redirection sentence twice in a row.
6. Do not mention "context", "knowledge base", or "documents" — answer naturally.
7. The user should NEVER feel ignored or rejected.

Context:
{context}"""

NO_CONTEXT_RESPONSE = "Hey there! 😊 I'm not sure about that one, but I'd love to help you with anything TechNexus-related — events, community info, how to join, and more!"

# --- App Setup ---
app = FastAPI(title="Community AI Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = []


@app.on_event("startup")
async def startup():
    """Pre-load the knowledge base on server start."""
    load_kb()


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Handle a chat message using RAG."""
    query = request.message.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Step 1: Retrieve relevant context from knowledge base
    context = get_context(query, top_k=3, min_score=0.15)

    if not context:
        return ChatResponse(reply=NO_CONTEXT_RESPONSE, sources=[])

    # Step 2: Build prompt with context
    system_message = SYSTEM_PROMPT.format(context=context)

    # Step 3: Call LLM
    if not MISTRAL_API_KEY:
        # Fallback: return raw context if no API key configured
        return ChatResponse(
            reply=context,
            sources=list({line.split("]")[0].replace("[Section: ", "") for line in context.split("\n") if line.startswith("[Section:")}),
        )

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

    # Extract source sections
    sources = list({line.split("]")[0].replace("[Section: ", "") for line in context.split("\n") if line.startswith("[Section:")})

    return ChatResponse(reply=reply, sources=sources)


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
