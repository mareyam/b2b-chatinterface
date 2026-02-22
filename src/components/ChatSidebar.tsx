import { Search } from "lucide-react";
import { Chat } from "@/data/chatData";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const ChatSidebar = ({ chats, activeChat, onSelectChat, searchQuery, onSearchChange }: ChatSidebarProps) => {
  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-chat-sidebar border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-chat-header">
        <h1 className="text-lg font-semibold text-primary-foreground tracking-tight">Chats</h1>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 bg-chat-search rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-border/50 ${
              activeChat === chat.id ? "bg-chat-search" : "hover:bg-chat-sidebar-hover"
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-chat-online border-2 border-chat-sidebar" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm truncate">{chat.name}</span>
                <span className="text-xs text-chat-timestamp flex-shrink-0">{chat.timestamp}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-chat-unread text-white text-xs flex items-center justify-center font-medium">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
