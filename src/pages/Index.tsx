import { useState, useEffect } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  timestamp: string;
  sent: boolean;
  attachments?: any[];
}

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingChat, setLoadingChat] = useState(true);

  const fetchChatsAndMessages = async () => {
    try {
      setLoadingChat(true);

      const res = await fetch(
        "https://cloud.b2b-accelerator.com/webhook/ee8a52a6-1e0b-4995-8008-d910ea232ebe",
        { method: "POST" }
      );

      const data = await res.json();

      const chatMap: Record<string, Chat> = {};
      const messageMap: Record<string, Message[]> = {};

      data.forEach((userProfile: any) => {
        const { first_name, last_name, messages } = userProfile;
        if (!messages) return;

        messages.forEach((m: any) => {
          const msg: Message = {
            id: m.id,
            chatId: m.chat_id,
            text: m.text || "",
            timestamp: m.timestamp,
            sent: m.is_sender === 1,
            attachments: m.attachments || [],
          };

          if (!messageMap[m.chat_id]) {
            messageMap[m.chat_id] = [];
          }

          messageMap[m.chat_id].push(msg);

          if (!chatMap[m.chat_id]) {
            chatMap[m.chat_id] = {
              id: m.chat_id,
              name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
              avatar: "",
              lastMessage: m.text || "",
              timestamp: m.timestamp,
              unread: m.seen === 0 && m.is_sender === 0 ? 1 : 0,
              online: false,
            };
          } else {
            if (m.seen === 0 && m.is_sender === 0) {
              chatMap[m.chat_id].unread += 1;
            }

            if (
              new Date(m.timestamp).getTime() >
              new Date(chatMap[m.chat_id].timestamp).getTime()
            ) {
              chatMap[m.chat_id].lastMessage = m.text || "";
              chatMap[m.chat_id].timestamp = m.timestamp;
            }
          }
        });
      });

      Object.keys(messageMap).forEach((chatId) => {
        messageMap[chatId].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });

      const sortedChats = Object.values(chatMap).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setChats(sortedChats);
      setMessages(messageMap);

      if (sortedChats.length > 0) {
        setActiveChat(sortedChats[0].id);
      }

      setLoadingChat(false);
    } catch (error) {
      console.error(error);
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    fetchChatsAndMessages();
  }, []);

  const handleSelectChat = async (id: string) => {
    setLoadingChat(true);
    setActiveChat(id);
    setLoadingChat(false);
  };

  const selectedChat = chats.find((c) => c.id === activeChat) || null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-[40%] border-r border-border">
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="w-[60%]">
        {loadingChat ||
        !activeChat ||
        (messages[activeChat]?.length ?? 0) === 0 ? (
          <div className="flex items-center justify-center h-full">
            Loading...
          </div>
        ) : (
          <ChatWindow
            chat={selectedChat}
            messages={messages[activeChat]}
            loading={false}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
