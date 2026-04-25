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

<<<<<<< HEAD
const renderWithLinks = (text: string, isBot: boolean) => {
  const parts = text.split(URL_REGEX);
  return parts.map((part, idx) => {
=======
/** Render inline markdown: **bold**, *italic*, and URLs as links */
const renderInline = (text: string, isBot: boolean): React.ReactNode[] => {
  // Split on bold (**...**), italic (*...*), and URLs
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"'])/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
>>>>>>> 49a2026 (fixed issues)
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
<<<<<<< HEAD
=======
  });
};

/**
 * Parse the bot reply into structured blocks so markdown renders properly.
 * Handles: headings (#, ##, ###), bullet lines (-, •, *), bold, italic, URLs.
 * Plain text lines and blank lines are handled too.
 */
const renderMarkdown = (text: string, isBot: boolean): React.ReactNode => {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = (key: string) => {
    if (bulletBuffer.length === 0) return;
    nodes.push(
      <ul key={key} className="list-disc list-inside space-y-0.5 mt-1 mb-1">
        {bulletBuffer.map((b, i) => (
          <li key={i} className="leading-snug">
            {renderInline(b, isBot)}
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();

    // Heading: ### or ## or #
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      flushBullets(`bl-${i}`);
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      const className =
        level === 1
          ? "font-bold text-base mt-2 mb-0.5"
          : level === 2
          ? "font-semibold text-sm mt-1.5 mb-0.5"
          : "font-semibold text-sm mt-1";
      nodes.push(
        <p key={i} className={className}>
          {renderInline(headingText, isBot)}
        </p>
      );
      return;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushBullets(`bl-${i}`);
      nodes.push(<hr key={i} className="border-t border-current opacity-20 my-1" />);
      return;
    }

    // Bullet line: starts with -, •, or * (not **)
    const bulletMatch = line.match(/^[\-\*•]\s+(.+)/);
    if (bulletMatch && !line.startsWith("**")) {
      bulletBuffer.push(bulletMatch[1]);
      return;
    }

    // Blank line — flush bullets, add spacing
    if (line.trim() === "") {
      flushBullets(`bl-${i}`);
      nodes.push(<span key={i} className="block h-1" />);
      return;
    }

    // Normal text line
    flushBullets(`bl-${i}`);
    nodes.push(
      <p key={i} className="leading-snug">
        {renderInline(line, isBot)}
      </p>
    );
>>>>>>> 49a2026 (fixed issues)
  });

  flushBullets("final");
  return <>{nodes}</>;
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
<<<<<<< HEAD
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-1" : ""}>
            {renderWithLinks(line, isBot)}
          </p>
        ))}
=======
        {isBot
          ? renderMarkdown(message.content, isBot)
          : message.content.split("\n").map((line, i) => (
              <p key={i} className={i > 0 ? "mt-1" : ""}>
                {line}
              </p>
            ))}
>>>>>>> 49a2026 (fixed issues)
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
