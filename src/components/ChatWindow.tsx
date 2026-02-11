import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import ChatMessage, { type Message } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  content:
    "Hi there! 👋 I'm the Community AI Assistant. I can help you with questions about our community overview, events, FAQ, roles, moderation, rules, and history. What would you like to know?",
  timestamp: new Date(),
};

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

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
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.reply,
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Fallback to local knowledge base search if backend is unavailable
      const { searchKnowledge } = await import("@/lib/knowledgeBase");
      const answer = searchKnowledge(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: answer,
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-24 right-5 w-[370px] max-w-[calc(100vw-2.5rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden chat-shadow animate-chat-slide-up flex flex-col bg-card border border-border z-50">
      {/* Header */}
      <div className="bg-chat-header px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-chat-header-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm text-chat-header-foreground">
              Community Assistant
            </h3>
            <p className="text-xs text-chat-header-foreground/70">Always here to help</p>
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
