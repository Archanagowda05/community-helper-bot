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

// Match http(s) URLs; stop at whitespace or trailing punctuation
const URL_REGEX = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g;

const renderWithLinks = (text: string, isBot: boolean) => {
  const parts = text.split(URL_REGEX);
  return parts.map((part, idx) => {
    if (part.match(/^https?:\/\//)) {
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 break-all ${
            isBot ? "text-primary hover:opacity-80" : "hover:opacity-80"
          }`}
        >
          {part}
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};

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
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words ${
          isBot
            ? "bg-chat-bubble-bot text-chat-bubble-bot-foreground rounded-tl-md"
            : "bg-chat-bubble-user text-chat-bubble-user-foreground rounded-tr-md"
        }`}
      >
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-1" : ""}>
            {renderWithLinks(line, isBot)}
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
