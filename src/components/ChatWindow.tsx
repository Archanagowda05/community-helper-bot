import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import ChatMessage, { type Message } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { searchKnowledge } from "@/lib/knowledgeBase";

// ── Mistral direct call ────────────────────────────────────────────────────
// Free tier: sign up at console.mistral.ai → Experiment plan (no credit card)
// Add VITE_MISTRAL_API_KEY=your_key_here to your .env file
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || "";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "open-mistral-nemo"; // free, fast, lightweight 12B model

const SYSTEM_PROMPT = `You are the TechNexus Support Assistant — friendly, warm, and professional.

STRICT RULES:
1. GREETINGS (hi/hello/hey/okay/lol — single casual words with NO question): Reply with ONE short warm line. Never start a factual answer with a greeting.
2. FACTUAL QUESTIONS: Answer directly using ONLY the context below. Do NOT prepend greetings. Just answer.
3. Keep answers SHORT (2-4 sentences). Use bullet points only when listing 3+ items.
4. Off-topic questions: Gently redirect. Vary your redirects.
5. NEVER hallucinate. NEVER repeat the same redirect twice in a row.
6. Never mention "context", "knowledge base", or "documents".

UPCOMING EVENT RULE (CRITICAL):
- For "upcoming", "next", "future", "latest" event questions: find the "## Upcoming Event" section in context and return its FULL details (name, date, location, time, description) as bullet points.
- NEVER use events from "Previous Events" or "Major Event Series" as the upcoming event.

LINKS RULE:
- LinkedIn: https://www.linkedin.com/company/technexuscommunity/
- Meetup: https://www.meetup.com/technexus-community/
- Instagram: https://www.instagram.com/technexus.community/
- YouTube: https://www.youtube.com/@TechNexus_Community

Context:
{context}`;

const NO_CONTEXT_RESPONSE =
  "I'm not sure about that one, but I'd love to help with anything TechNexus-related — events, community info, how to join, and more! 😊";

async function callMistral(userMessage: string): Promise<string> {
  // Use local knowledge base to build context (same logic as Python backend)
  const context = searchKnowledge(userMessage);

  // No API key → fall back to local knowledge base answer directly
  if (!MISTRAL_API_KEY) {
    return context || NO_CONTEXT_RESPONSE;
  }

  const systemWithContext = SYSTEM_PROMPT.replace(
    "{context}",
    context || "No specific context found."
  );

  const response = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      messages: [
        { role: "system", content: systemWithContext },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Mistral API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? NO_CONTEXT_RESPONSE;
}

// ── Component ──────────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  content:
    "Hi there! 👋 I'm the TechNexus Support Bot. I can help you with questions about our community, events, rules, roles, moderation, and more. What would you like to know?",
  timestamp: new Date(),
};

const SUGGESTION_CHIPS = [
  { label: "📅 Events", query: "Tell me about upcoming events" },
  { label: "📜 Rules", query: "What are the community rules?" },
  { label: "❓ FAQ", query: "Show me frequently asked questions" },
  { label: "ℹ️ About Us", query: "Tell me about TechNexus" },
  { label: "🚀 Getting Started", query: "How do I get started?" },
  { label: "📖 History", query: "Tell me about the community history" },
];

interface ChatWindowProps {
  onClose: () => void;
  className?: string;
}

const ChatWindow = ({ onClose, className = "" }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [chipsSent, setChipsSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    setShowChips(false);
    setChipsSent(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await callMistral(text);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "bot", content: reply, timestamp: new Date() },
      ]);
      setShowChips(true);
    } catch (err) {
      // Graceful fallback: use local knowledge base if Mistral fails
      console.error("[ChatBot] Mistral API failed, using local fallback:", err);
      const answer = searchKnowledge(text);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: answer || NO_CONTEXT_RESPONSE,
          timestamp: new Date(),
        },
      ]);
      setShowChips(true);
    }
  };

  const handleSend = () => sendMessage(input.trim());
  const handleChipClick = (query: string) => sendMessage(query);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className={`fixed bottom-24 right-5 w-[370px] max-w-[calc(100vw-2.5rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden chat-shadow flex flex-col bg-card border border-border z-50 ${className}`}>
      {/* Header */}
      <div className="bg-chat-header px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-chat-header-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm text-chat-header-foreground">
              TechNexus Support
            </h3>
            <p className="text-xs text-chat-header-foreground/70">Ask anything about our community</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-chat-header-foreground/70 hover:text-chat-header-foreground hover:bg-primary-foreground/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {showChips && !isTyping && (
          <div className="flex flex-wrap gap-2 pt-1">
            <p className="w-full text-xs text-muted-foreground mb-1">
              {chipsSent ? "What else would you like to know?" : "Quick topics to explore:"}
            </p>
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip.query)}
                className="px-3 py-1.5 text-xs rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 transition-colors whitespace-nowrap"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-1.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about our community..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1.5"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Answers are based on our community knowledge base only.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;