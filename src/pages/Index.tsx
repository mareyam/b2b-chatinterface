import { useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import { mockChats, mockMessages, Message } from "@/data/chatData";

const Index = () => {
  const [activeChat, setActiveChat] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = (text: string) => {
    if (!activeChat) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      chatId: activeChat,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sent: true,
    };
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg],
    }));
  };

  const activeMessages = activeChat ? messages[activeChat] || [] : [];
  const activeChatData = mockChats.find((c) => c.id === activeChat) || null;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-[380px] flex-shrink-0">
        <ChatSidebar
          chats={mockChats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Chat Window */}
      <ChatWindow
        chat={activeChatData}
        messages={activeMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Index;
