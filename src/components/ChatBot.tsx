import { useState, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = useCallback(() => {
    setIsClosing(false);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    // Play close animation, then unmount
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }, []);

  return (
    <>
      {isOpen && (
        <ChatWindow
          onClose={handleClose}
          className={isClosing ? "animate-chat-slide-down" : "animate-chat-slide-up"}
        />
      )}

      <button
        onClick={isOpen ? handleClose : handleOpen}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center chat-button-shadow hover:scale-105 active:scale-95 transition-transform z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen && !isClosing ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
};

export default ChatBot;
