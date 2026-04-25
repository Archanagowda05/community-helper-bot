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


<<<<<<< HEAD
def search(query: str, top_k: int = 3) -> list[dict]:
=======
def _is_upcoming_query(query: str) -> bool:
    """Return True if the query is asking about the next/upcoming event."""
    q = query.lower()
    return any(kw in q for kw in _UPCOMING_KEYWORDS) and "event" in q


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


def search(query: str, top_k: int = 3) -> list:
>>>>>>> 49a2026 (fixed issues)
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

    For queries about the next/upcoming event, the chunk containing
    'Upcoming Event' from events.md is always injected first so the
    LLM never confuses a past event for the upcoming one.

    Args:
        query: The user's question.
        top_k: Max number of chunks to include.
        min_score: Minimum similarity score to include a chunk.

    Returns:
        Formatted context string, or empty string if nothing relevant found.
    """
    load_kb()

    results = search(query, top_k=top_k)
    relevant = [r for r in results if r["score"] >= min_score]

    # For upcoming-event queries, guarantee the correct chunk is present
    # and ranked first — this prevents stale or lower-ranked chunks from
    # misleading the LLM.
    if _is_upcoming_query(query):
        upcoming_chunk = _get_upcoming_event_chunk()
        if upcoming_chunk:
            # Remove it from results if already there (avoid duplicate)
            relevant = [r for r in relevant if r.get("text") != upcoming_chunk.get("text")]
            # Pin it at the top with a high synthetic score
            pinned = upcoming_chunk.copy()
            pinned["score"] = 1.0
            relevant = [pinned] + relevant

    if not relevant:
        return ""

    context_parts = []
    for r in relevant:
        context_parts.append(f"[Section: {r['section']}]\n{r['text']}")

    return "\n\n---\n\n".join(context_parts)