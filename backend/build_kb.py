"""
build_kb.py — Build FAISS vector index from markdown knowledge base files.

Usage:
    pip install sentence-transformers faiss-cpu
    python build_kb.py

This script reads all .md files from the knowledge_base/ directory,
splits them into chunks, generates embeddings, and saves a FAISS index + metadata.
"""

import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

KNOWLEDGE_DIR = "knowledge_base"
INDEX_FILE = "kb_index.faiss"
METADATA_FILE = "kb_metadata.json"
CHUNK_SIZE = 500  # characters per chunk
CHUNK_OVERLAP = 50
MODEL_NAME = "all-MiniLM-L6-v2"


def load_md_files(directory: str) -> list[dict]:
    """Load all .md files and return list of {section, content}."""
    documents = []
    for filename in sorted(os.listdir(directory)):
        if not filename.endswith(".md"):
            continue
        filepath = os.path.join(directory, filename)
        section = filename.replace(".md", "")
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read().strip()
        documents.append({"section": section, "content": content})
    return documents


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks by character count."""
    chunks = []
    # Split by double newlines first (paragraphs), then combine
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    current_chunk = ""
    for para in paragraphs:
        if len(current_chunk) + len(para) + 2 > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            # Keep overlap from end of previous chunk
            current_chunk = current_chunk[-overlap:] + "\n\n" + para
        else:
            current_chunk = (current_chunk + "\n\n" + para).strip()

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


def build_index():
    print(f"Loading markdown files from '{KNOWLEDGE_DIR}/'...")
    documents = load_md_files(KNOWLEDGE_DIR)
    print(f"Found {len(documents)} documents.")

    # Chunk all documents
    all_chunks = []
    metadata = []
    for doc in documents:
        chunks = chunk_text(doc["content"])
        for chunk in chunks:
            all_chunks.append(chunk)
            metadata.append({"section": doc["section"], "text": chunk})

    print(f"Created {len(all_chunks)} chunks.")

    # Generate embeddings
    print(f"Loading embedding model '{MODEL_NAME}'...")
    model = SentenceTransformer(MODEL_NAME)
    print("Generating embeddings...")
    embeddings = model.encode(all_chunks, show_progress_bar=True, normalize_embeddings=True)
    embeddings = np.array(embeddings, dtype="float32")

    # Build FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)  # Inner product (cosine similarity with normalized vectors)
    index.add(embeddings)
    print(f"FAISS index built with {index.ntotal} vectors (dim={dimension}).")

    # Save index and metadata
    faiss.write_index(index, INDEX_FILE)
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    print(f"Saved index to '{INDEX_FILE}' and metadata to '{METADATA_FILE}'.")
    print("Done! You can now run the server with: python main.py")


if __name__ == "__main__":
    build_index()
