"""
kb.py — Knowledge base search using FAISS vector index.

Provides functions to load the pre-built index and search for relevant chunks.
Index files are stored alongside this script in the backend/ directory.
"""

import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Resolve paths so kb.py always finds the index files next to itself,
# regardless of the working directory FastAPI/uvicorn is started from.
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

INDEX_FILE = os.path.join(_SCRIPT_DIR, "kb_index.faiss")
METADATA_FILE = os.path.join(_SCRIPT_DIR, "kb_metadata.json")
MODEL_NAME = "all-MiniLM-L6-v2"

# Keywords that indicate the user is asking about the NEXT / UPCOMING event
_UPCOMING_KEYWORDS = {
    "upcoming", "next", "future", "soon", "latest", "new event",
    "what event", "any event", "nearest", "scheduled",
}

# Keywords that indicate the user is asking about PAST / ALL events
_PAST_EVENT_KEYWORDS = {
    "past", "previous", "all events", "list all", "history", "hosted",
    "happened", "held", "2024", "2025", "2026", "completed", "done",
    "old events", "prior", "last event", "earlier",
}

# Chunk text snippets that belong to the "Previous Events" section
_PAST_EVENT_MARKERS = [
    "Previous Events",
    "GitHub Copilot Dev Day",
    "Agentic AI Connect",
    "Sprint to Imagine Cup",
    "AgentVerse",
    "GenAI Bootcamp",
    "InnovateHer",
    "AI in Action",
    "Learn Azure",
    "Code & Cold Pizza",
    "AI Native Meetup",
]

# Global state (loaded once)
_index = None
_metadata = None
_model = None


def load_kb():
    """Load the FAISS index, metadata, and embedding model into memory."""
    global _index, _metadata, _model

    if _index is not None:
        return  # Already loaded

    if not os.path.exists(INDEX_FILE):
        raise FileNotFoundError(
            f"FAISS index not found at {INDEX_FILE}. "
            "Please run `python build_kb.py` first."
        )

    print("Loading knowledge base...")
    _index = faiss.read_index(INDEX_FILE)
    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        _metadata = json.load(f)
    _model = SentenceTransformer(MODEL_NAME)
    print(f"Knowledge base loaded: {_index.ntotal} vectors.")


def _is_upcoming_query(query: str) -> bool:
    """Return True if the query is asking about the next/upcoming event."""
    q = query.lower()
    return any(kw in q for kw in _UPCOMING_KEYWORDS) and "event" in q


def _is_past_events_query(query: str) -> bool:
    """Return True if the query is asking about past or all events."""
    q = query.lower()
    return any(kw in q for kw in _PAST_EVENT_KEYWORDS) and "event" in q


def _get_upcoming_event_chunk():
    """
    Find the chunk that contains the 'Upcoming Event' section heading
    from events.md. Returns None if not found.
    """
    if _metadata is None:
        return None
    for entry in _metadata:
        if entry.get("section") == "events" and "Upcoming Event" in entry.get("text", ""):
            return entry
    return None


def _get_past_event_chunks():
    """
    Return all chunks from events.md that contain past event data.
    The full list is spread across multiple chunks due to chunking, so
    we collect all of them to give the LLM the complete picture.
    """
    if _metadata is None:
        return []
    chunks = []
    seen_texts = set()
    for entry in _metadata:
        if entry.get("section") != "events":
            continue
        text = entry.get("text", "")
        if any(marker in text for marker in _PAST_EVENT_MARKERS) and text not in seen_texts:
            chunks.append(entry)
            seen_texts.add(text)
    return chunks


def search(query: str, top_k: int = 3) -> list:
    """
    Search the knowledge base for the most relevant chunks.

    Args:
        query: The user's question.
        top_k: Number of results to return.

    Returns:
        List of dicts with 'section', 'text', and 'score'.
    """
    load_kb()

    # Encode query
    query_vector = _model.encode([query], normalize_embeddings=True)
    query_vector = np.array(query_vector, dtype="float32")

    # Search FAISS index
    scores, indices = _index.search(query_vector, top_k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx < 0 or idx >= len(_metadata):
            continue
        entry = _metadata[idx].copy()
        entry["score"] = float(score)
        results.append(entry)

    return results


def get_context(query: str, top_k: int = 3, min_score: float = 0.15) -> str:
    """
    Get formatted context string for the LLM prompt.

    - For upcoming event queries: pins the 'Upcoming Event' chunk first.
    - For past/all event queries: injects ALL past event chunks so the
      LLM always sees the complete list, not just 3 random chunks.

    Args:
        query: The user's question.
        top_k: Max number of chunks to include (auto-increased for event lists).
        min_score: Minimum similarity score to include a chunk.

    Returns:
        Formatted context string, or empty string if nothing relevant found.
    """
    load_kb()

    # Past events queries need more chunks — the list spans 5+ chunks
    if _is_past_events_query(query):
        top_k = max(top_k, 10)

    results = search(query, top_k=top_k)
    relevant = [r for r in results if r["score"] >= min_score]

    # --- Upcoming event: pin the correct chunk at the top ---
    if _is_upcoming_query(query):
        upcoming_chunk = _get_upcoming_event_chunk()
        if upcoming_chunk:
            relevant = [r for r in relevant if r.get("text") != upcoming_chunk.get("text")]
            pinned = upcoming_chunk.copy()
            pinned["score"] = 1.0
            relevant = [pinned] + relevant

    # --- Past / all events: inject every past-event chunk ---
    elif _is_past_events_query(query):
        past_chunks = _get_past_event_chunks()
        if past_chunks:
            existing_texts = {r.get("text") for r in relevant}
            # Prepend any past-event chunks not already in results
            injected = []
            for chunk in past_chunks:
                if chunk.get("text") not in existing_texts:
                    pinned = chunk.copy()
                    pinned["score"] = 1.0
                    injected.append(pinned)
                    existing_texts.add(chunk.get("text"))
            relevant = injected + relevant

    if not relevant:
        return ""

    context_parts = []
    for r in relevant:
        context_parts.append(f"[Section: {r['section']}]\n{r['text']}")

    return "\n\n---\n\n".join(context_parts)