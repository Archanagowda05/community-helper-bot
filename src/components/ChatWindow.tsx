import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import ChatMessage, { type Message } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

// ── Import markdown files directly (Vite ?raw — exact source of truth) ────
import eventsMd    from "../../knowledge_base/events.md?raw";
import faqMd       from "../../knowledge_base/faq.md?raw";
import overviewMd  from "../../knowledge_base/overview.md?raw";
import rulesMd     from "../../knowledge_base/rules.md?raw";
import rolesMd     from "../../knowledge_base/roles.md?raw";
import moderationMd from "../../knowledge_base/moderation.md?raw";
import historyMd   from "../../knowledge_base/history.md?raw";
import gettingStartedMd from "../../knowledge_base/getting_started.md?raw";

// Full knowledge base = all markdown files concatenated
const FULL_KNOWLEDGE_BASE = `
# TECHNEXUS KNOWLEDGE BASE
## This is the ONLY source of truth. Do not use any other information.

${eventsMd}

---

${faqMd}

---

${overviewMd}

---

${rulesMd}

---

${rolesMd}

---

${moderationMd}

---

${historyMd}

---

${gettingStartedMd}
`.trim();

// ── Mistral API ────────────────────────────────────────────────────────────
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || "";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "open-mistral-nemo";

const SYSTEM_PROMPT = `You are the official TechNexus Community Support Assistant.

YOUR ONLY SOURCE OF TRUTH IS THE KNOWLEDGE BASE BELOW.
You must NEVER use any information outside of it.

════════════════════════════════════════
STRICT RULES — NEVER BREAK THESE
════════════════════════════════════════

1. ONLY answer using information explicitly present in the KNOWLEDGE BASE below.
   If it's not there, say: "I don't have that information. For latest updates visit https://technexuscommunity.in or https://www.meetup.com/technexus-community/"

2. EVENTS — NEVER INVENT:
   - Only mention events that are explicitly written in the knowledge base.
   - The upcoming event is ONLY what is listed under "## Upcoming Event" in events.md.
   - Past events are ONLY what is listed under "## Previous Events". They are COMPLETED — never call them upcoming.
   - If asked about an event not in the knowledge base, say you don't have info and give the Meetup link.
   - NEVER make up event names, dates, venues, cities, or times.

3. OFF-TOPIC: If the question is not about TechNexus, say:
   "I can only help with TechNexus community questions. Visit https://technexuscommunity.in for more. 😊"

4. FORMAT:
   - Pure greeting (hi/hello/hey): ONE short warm line only.
   - All other questions: answer directly, 2-4 sentences, no greeting prefix.
   - Bullet points only for 3+ items.
   - Never mention "knowledge base", "context", or "documents".

════════════════════════════════════════
KNOWLEDGE BASE:
════════════════════════════════════════
${FULL_KNOWLEDGE_BASE}`;

const FALLBACK =
  "I don't have that information right now. For latest updates visit https://technexuscommunity.in or https://www.meetup.com/technexus-community/ 😊";

async function callMistral(userMessage: string): Promise<string> {
  if (!MISTRAL_API_KEY) return FALLBACK;

  const response = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.05,
      max_tokens: 512,
    }),
  });

  if (!response.ok) throw new Error(`Mistral error ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? FALLBACK;
}

// ── Component ──────────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  content: "Hi there! 👋 I'm the TechNexus Support Bot. Ask me anything about our community, events, rules, roles, and more!",
  timestamp: new Date(),
};

const SUGGESTION_CHIPS = [
  { label: "📅 Upcoming Event", query: "What is the upcoming event?" },
  { label: "📜 Rules",          query: "What are the community rules?" },
  { label: "❓ FAQ",            query: "Show me frequently asked questions" },
  { label: "ℹ️ About Us",      query: "Tell me about TechNexus" },
  { label: "🚀 Get Started",   query: "How do I get started?" },
  { label: "🔗 Links",         query: "Give me all TechNexus social links" },
];

interface ChatWindowProps {
  onClose: () => void;
  className?: string;
}

const ChatWindow = ({ onClose, className = "" }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [chipsSent, setChipsSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    setShowChips(false);
    setChipsSent(true);

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await callMistral(text);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: "bot", content: reply, timestamp: new Date() }]);
    } catch (err) {
      console.error("[ChatBot] Mistral failed:", err);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: "bot", content: FALLBACK, timestamp: new Date() }]);
    }
    setShowChips(true);
  };

  const handleSend    = () => sendMessage(input.trim());
  const handleChip    = (q: string) => sendMessage(q);
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
            <h3 className="font-heading font-semibold text-sm text-chat-header-foreground">TechNexus Support</h3>
            <p className="text-xs text-chat-header-foreground/70">Ask anything about our community</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-chat-header-foreground/70 hover:text-chat-header-foreground hover:bg-primary-foreground/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        {showChips && !isTyping && (
          <div className="flex flex-wrap gap-2 pt-1">
            <p className="w-full text-xs text-muted-foreground mb-1">
              {chipsSent ? "What else would you like to know?" : "Quick topics to explore:"}
            </p>
            {SUGGESTION_CHIPS.map(chip => (
              <button key={chip.label} onClick={() => handleChip(chip.query)}
                className="px-3 py-1.5 text-xs rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 transition-colors whitespace-nowrap">
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
          <input ref={inputRef} type="text" value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Ask about our community..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1.5" />
          <button onClick={handleSend} disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Info sourced from TechNexus knowledge base only ·{" "}
          <a href="https://technexuscommunity.in" target="_blank" rel="noreferrer" className="underline">technexuscommunity.in</a>
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;