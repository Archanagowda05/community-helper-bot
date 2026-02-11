import { Bot, User } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isBot = message.role === "bot";

  return (
    <div
      className={`flex gap-2.5 animate-chat-fade-in ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center mt-1">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot
            ? "bg-chat-bubble-bot text-chat-bubble-bot-foreground rounded-tl-md"
            : "bg-chat-bubble-user text-chat-bubble-user-foreground rounded-tr-md"
        }`}
      >
        {message.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {paragraph}
          </p>
        ))}
      </div>
      {!isBot && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary flex items-center justify-center mt-1">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
