// denise : aKRJANFuRVKXTgQP63giaw
// PS: xcUauzdUQ8SPhqf7kwUH9w
// Shabir : kNeTbjC0T9u0M8I8geOFdQ

import { Search, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { Chat } from "@/data/chatData";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedUser: string; // 🔥 FROM INDEX
  onUserChange: (user: any) => void; // 🔥 FROM INDEX
  users: string[];
}

const ChatSidebar = ({
  chats,
  activeChat,
  onSelectChat,
  searchQuery,
  onSearchChange,
  selectedUser,
  onUserChange,
  users,
}: ChatSidebarProps) => {
  console.log(selectedUser);
  console.log("selectedUser");

  const [open, setOpen] = useState(false);

  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${mm}-${dd}-${yyyy} ${hh}:${min}`;
  };

  return (
    <div className="flex flex-col h-full bg-chat-sidebar border-r border-border">
      {/* Header */}
      <div className="relative px-4 py-3 bg-chat-header">
        {/* Custom Dropdown */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between bg-chat-search hover:bg-chat-sidebar-hover px-3 py-2 rounded-lg cursor-pointer transition"
        >
          <span className="text-sm font-medium text-foreground">
            {selectedUser}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
          />
        </div>

        {open && (
          <div className="absolute left-4 right-4 mt-2 bg-chat-sidebar border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            {users.map((user) => (
              <div
                key={user}
                onClick={() => {
                  onUserChange(user);
                  setOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-chat-sidebar-hover cursor-pointer transition"
              >
                {user}
                {selectedUser === user && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        )}
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
              activeChat === chat.id
                ? "bg-chat-search"
                : "hover:bg-chat-sidebar-hover"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
              {chat.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm truncate">
                  {chat.name}
                </span>
                <span className="text-xs text-chat-timestamp flex-shrink-0">
                  {formatTimestamp(chat.timestamp)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
