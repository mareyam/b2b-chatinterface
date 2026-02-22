import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Chat, Message } from "@/data/chatData";

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
}

const ChatWindow = ({ chat, messages }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-bg">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-20 h-20 text-primary/30" />
          </div>
          <h2 className="text-2xl font-light text-muted-foreground">WhatsApp Web</h2>
          <p className="text-sm text-muted-foreground mt-2">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center px-4 py-2.5 bg-chat-header">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-semibold text-primary-foreground">
              {chat.avatar}
            </div>
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-chat-online border-2 border-chat-header" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary-foreground">{chat.name}</h2>
            <p className="text-xs text-primary-foreground/70">
              {chat.online ? "online" : "last seen recently"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-16 py-4 space-y-1"
        style={{ backgroundColor: "hsl(var(--chat-bg))" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[65%] px-3 py-1.5 rounded-lg text-sm relative ${
                msg.sent
                  ? "bg-chat-bubble-sent text-foreground rounded-tr-none"
                  : "bg-chat-bubble-received text-foreground rounded-tl-none"
              }`}
              style={{ boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}
            >
              <span>{msg.text}</span>
              <span className="text-[11px] text-chat-timestamp ml-3 float-right mt-1">
                {msg.timestamp}
                {msg.sent && <span className="ml-1" style={{ color: "hsl(210, 80%, 55%)" }}>✓✓</span>}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
