"""
kb.py — Knowledge base search using FAISS vector index.

Provides functions to load the pre-built index and search for relevant chunks.
"""

import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

INDEX_FILE = "kb_index.faiss"
METADATA_FILE = "kb_metadata.json"
MODEL_NAME = "all-MiniLM-L6-v2"

# Global state (loaded once)
_index = None
_metadata = None
_model = None


def load_kb():
    """Load the FAISS index, metadata, and embedding model into memory."""
    global _index, _metadata, _model

    if _index is not None:
        return  # Already loaded

    print("Loading knowledge base...")
    _index = faiss.read_index(INDEX_FILE)
    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        _metadata = json.load(f)
    _model = SentenceTransformer(MODEL_NAME)
    print(f"Knowledge base loaded: {_index.ntotal} vectors.")


def search(query: str, top_k: int = 3) -> list[dict]:
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

    Args:
        query: The user's question.
        top_k: Max number of chunks to include.
        min_score: Minimum similarity score to include a chunk.

    Returns:
        Formatted context string, or empty string if nothing relevant found.
    """
    results = search(query, top_k=top_k)
    relevant = [r for r in results if r["score"] >= min_score]

    if not relevant:
        return ""

    context_parts = []
    for r in relevant:
        context_parts.append(f"[Section: {r['section']}]\n{r['text']}")

    return "\n\n---\n\n".join(context_parts)
