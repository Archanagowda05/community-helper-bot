const TypingIndicator = () => (
  <div className="flex gap-2.5 justify-start animate-chat-fade-in">
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center mt-1">
      <div className="w-4 h-4 rounded-full bg-primary-foreground/30" />
    </div>
    <div className="bg-chat-bubble-bot rounded-2xl rounded-tl-md px-4 py-3 flex gap-1.5 items-center">
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-typing-dot-1" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-typing-dot-2" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-typing-dot-3" />
    </div>
  </div>
);

export default TypingIndicator;
