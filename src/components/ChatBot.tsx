import { useState, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      // Start close animation
      setIsOpen(false);
      // Remove from DOM after animation
      setTimeout(() => setIsVisible(false), 250);
    } else {
      // Show immediately, animation plays via CSS
      setIsVisible(true);
      setIsOpen(true);
    }
  }, [isOpen]);

  return (
    <>
      {isVisible && (
        <ChatWindow
          onClose={handleToggle}
          className={isOpen ? "animate-chat-slide-up" : "animate-chat-slide-down"}
        />
      )}

      <button
        onClick={handleToggle}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center chat-button-shadow hover:scale-105 active:scale-95 transition-transform z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
};

export default ChatBot;
