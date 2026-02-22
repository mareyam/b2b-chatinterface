import { useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import { mockChats, mockMessages } from "@/data/chatData";

const Index = () => {
  const [activeChat, setActiveChat] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const activeMessages = activeChat ? mockMessages[activeChat] || [] : [];
  const activeChatData = mockChats.find((c) => c.id === activeChat) || null;

  return (
    <div className="flex h-screen bg-background">
      <div className="w-[380px] flex-shrink-0">
        <ChatSidebar
          chats={mockChats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <ChatWindow chat={activeChatData} messages={activeMessages} />
    </div>
  );
};

export default Index;
