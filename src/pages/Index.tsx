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

  useEffect(() => {
    const fetchChatsAndMessages = async () => {
      try {
        const res = await fetch(
          "https://cloud.b2b-accelerator.com/webhook/ee8a52a6-1e0b-4995-8008-d910ea232ebe",
          { method: "POST" }
        );

        const data = await res.json();

        const chatMap: Record<string, Chat> = {};
        const messageMap: Record<string, Message[]> = {};

        data.forEach((userProfile: any) => {
          const { first_name, last_name, messages } = userProfile;

          if (!messages || !Array.isArray(messages)) return;

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
                avatar: "", // we will render initials
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

        // Sort messages (oldest → newest)
        Object.keys(messageMap).forEach((chatId) => {
          messageMap[chatId].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });

        // Sort chats (newest → oldest)
        const sortedChats = Object.values(chatMap).sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setChats(sortedChats);
        setMessages(messageMap);

        // Auto-select first chat
        if (sortedChats.length > 0) {
          setActiveChat(sortedChats[0].id);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChatsAndMessages();
  }, []);

  const selectedChat = chats.find((c) => c.id === activeChat) || null;
  const [loadingChat, setLoadingChat] = useState(false);
  const handleSelectChat = (id: string) => {
    setLoadingChat(true);
    setActiveChat(id);

    setTimeout(() => {
      setLoadingChat(false);
    }, 400);
  };

  console.log("loading is", loadingChat);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-[30%] border-r border-border">
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="w-[70%]">
        <ChatWindow
          chat={selectedChat}
          messages={activeChat ? messages[activeChat] || [] : []}
          loading={loadingChat}
        />
      </div>
    </div>
  );
};

export default Index;
// change 9.05
// import { useState, useEffect } from "react";
// import ChatSidebar from "@/components/ChatSidebar";
// import ChatWindow from "@/components/ChatWindow";

// export interface Chat {
//   id: string;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp: string;
//   unread: number;
//   online: boolean;
// }

// export interface Message {
//   id: string;
//   chatId: string;
//   text: string;
//   timestamp: string;
//   sent: boolean;
//   attachments?: any[];
// }

// const Index = () => {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [messages, setMessages] = useState<Record<string, Message[]>>({});
//   const [activeChat, setActiveChat] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchChatsAndMessages = async () => {
//       try {
//         const res = await fetch(
//           "https://cloud.b2b-accelerator.com/webhook/ee8a52a6-1e0b-4995-8008-d910ea232ebe",
//           { method: "POST" }
//         );

//         const data = await res.json();

//         const chatMap: Record<string, Chat> = {};
//         const messageMap: Record<string, Message[]> = {};

//         data.forEach((userProfile: any) => {
//           const { first_name, last_name, messages } = userProfile;

//           if (!messages || !Array.isArray(messages)) return;

//           messages.forEach((m: any) => {
//             const msg: Message = {
//               id: m.id,
//               chatId: m.chat_id,
//               text: m.text || "",
//               timestamp: m.timestamp,
//               sent: m.is_sender === 1,
//               attachments: m.attachments || [],
//             };

//             if (!messageMap[m.chat_id]) {
//               messageMap[m.chat_id] = [];
//             }

//             messageMap[m.chat_id].push(msg);

//             if (!chatMap[m.chat_id]) {
//               chatMap[m.chat_id] = {
//                 id: m.chat_id,
//                 name: `${first_name} ${last_name}`,
//                 avatar: "", // not provided by backend
//                 lastMessage: m.text || "",
//                 timestamp: m.timestamp,
//                 unread: m.seen === 0 && m.is_sender === 0 ? 1 : 0,
//                 online: false,
//               };
//             } else {
//               if (m.seen === 0 && m.is_sender === 0) {
//                 chatMap[m.chat_id].unread += 1;
//               }

//               if (
//                 new Date(m.timestamp) > new Date(chatMap[m.chat_id].timestamp)
//               ) {
//                 chatMap[m.chat_id].lastMessage = m.text || "";
//                 chatMap[m.chat_id].timestamp = m.timestamp;
//               }
//             }
//           });
//         });

//         // Sort messages oldest → newest
//         Object.keys(messageMap).forEach((chatId) => {
//           messageMap[chatId].sort(
//             (a, b) =>
//               new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//           );
//         });

//         // Sort chats newest → oldest
//         const sortedChats = Object.values(chatMap).sort(
//           (a, b) =>
//             new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//         );

//         setChats(sortedChats);
//         setMessages(messageMap);

//         // Auto-select first chat
//         if (sortedChats.length > 0) {
//           setActiveChat(sortedChats[0].id);
//         }
//       } catch (error) {
//         console.error("Error fetching chats:", error);
//       }
//     };

//     fetchChatsAndMessages();
//   }, []);

//   return (
//     <div className="flex h-screen">
//       <ChatSidebar
//         chats={chats}
//         activeChat={activeChat}
//         setActiveChat={setActiveChat}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//       />
//       <ChatWindow
//         chatId={activeChat}
//         messages={activeChat ? messages[activeChat] || [] : []}
//       />
//     </div>
//   );
// };

// export default Index;

// // import { useState, useEffect } from "react";
// // import ChatSidebar from "@/components/ChatSidebar";
// // import ChatWindow from "@/components/ChatWindow";

// // export interface Chat {
// //   id: string;
// //   name: string;
// //   avatar: string;
// //   lastMessage: string;
// //   timestamp: string;
// //   unread: number;
// //   online: boolean;
// // }

// // export interface Message {
// //   id: string;
// //   chatId: string;
// //   text: string;
// //   timestamp: string;
// //   sent: boolean;
// //   attachments?: any[];
// // }

// // const Index = () => {
// //   const [chats, setChats] = useState<Chat[]>([]);
// //   const [messages, setMessages] = useState<Record<string, Message[]>>({});
// //   const [activeChat, setActiveChat] = useState<string | null>(null);
// //   const [searchQuery, setSearchQuery] = useState("");

// //   // Format timestamp as MM-DD-YYYY HH:MM
// //   const formatTimestamp = (timestamp: string) => {
// //     const date = new Date(timestamp);
// //     const mm = String(date.getMonth() + 1).padStart(2, "0");
// //     const dd = String(date.getDate()).padStart(2, "0");
// //     const yyyy = date.getFullYear();
// //     const hh = String(date.getHours()).padStart(2, "0");
// //     const min = String(date.getMinutes()).padStart(2, "0");
// //     return `${mm}-${dd}-${yyyy} ${hh}:${min}`;
// //   };

// //   useEffect(() => {
// //     const fetchChatsAndMessages = async () => {
// //       const res = await fetch(
// //         "https://cloud.b2b-accelerator.com/webhook/ee8a52a6-1e0b-4995-8008-d910ea232ebe",
// //         { method: "POST" }
// //       );
// //       const data = await res.json();
// //       console.log("data");
// //       console.log(data);

// //       const chatMap: Record<string, Chat> = {};
// //       const messageMap: Record<string, Message[]> = {};

// //       data.forEach((userProfile: any) => {
// //         const { first_name, last_name, profile_picture_url, messages } =
// //           userProfile;

// //         messages.forEach((m: any) => {
// //           // Add message
// //           const msg: Message = {
// //             id: m.id,
// //             chatId: m.chat_id,
// //             text: m.text,
// //             timestamp: m.timestamp,
// //             sent: m.is_sender === 1,
// //             attachments: m.attachments || [],
// //           };
// //           if (!messageMap[m.chat_id]) messageMap[m.chat_id] = [];
// //           messageMap[m.chat_id].push(msg);

// //           // Create chat entry if it doesn't exist
// //           if (!chatMap[m.chat_id]) {
// //             chatMap[m.chat_id] = {
// //               id: m.chat_id,
// //               name: `${first_name} ${last_name}`,
// //               avatar: profile_picture_url || "",
// //               lastMessage: m.text,
// //               timestamp: m.timestamp,
// //               unread: 0, // You can calculate unread based on m.seen
// //               online: false, // Optional: derive online from userProfile if you have it
// //             };
// //           } else {
// //             // Update lastMessage if newer
// //             if (
// //               new Date(m.timestamp) > new Date(chatMap[m.chat_id].timestamp)
// //             ) {
// //               chatMap[m.chat_id].lastMessage = m.text;
// //               chatMap[m.chat_id].timestamp = m.timestamp;
// //             }
// //           }
// //         });
// //       });

// //       setChats(Object.values(chatMap));
// //       setMessages(messageMap);
// //     };

// //     fetchChatsAndMessages();
// //   }, []);

// //   return (
// //     <div className="flex h-screen">
// //       <ChatSidebar
// //         chats={chats}
// //         activeChat={activeChat}
// //         setActiveChat={setActiveChat}
// //         searchQuery={searchQuery}
// //         setSearchQuery={setSearchQuery}
// //       />
// //       <ChatWindow
// //         chatId={activeChat}
// //         messages={activeChat ? messages[activeChat] || [] : []}
// //       />
// //     </div>
// //   );
// // };

// // export default Index;
// // // import { useState, useEffect } from "react";
// // // import ChatSidebar from "@/components/ChatSidebar";
// // // import ChatWindow from "@/components/ChatWindow";

// // // export interface Chat {
// // //   id: string;
// // //   name: string;
// // //   avatar: string;
// // //   lastMessage: string;
// // //   timestamp: string;
// // //   unread: number;
// // //   online: boolean;
// // // }

// // // export interface Message {
// // //   id: string;
// // //   chatId: string;
// // //   text: string;
// // //   timestamp: string;
// // //   sent: boolean;
// // //   attachments?: any[];
// // // }

// // // const Index = () => {
// // //   const [chats, setChats] = useState<Chat[]>([]);
// // //   const [messages, setMessages] = useState<Record<string, Message[]>>({});
// // //   const [activeChat, setActiveChat] = useState<string | null>(null);
// // //   const [searchQuery, setSearchQuery] = useState("");

// // //   // Helper to format timestamp as MM-DD-YYYY HH:MM
// // //   const formatTimestamp = (timestamp: string) => {
// // //     const date = new Date(timestamp);
// // //     const mm = String(date.getMonth() + 1).padStart(2, "0");
// // //     const dd = String(date.getDate()).padStart(2, "0");
// // //     const yyyy = date.getFullYear();
// // //     const hh = String(date.getHours()).padStart(2, "0");
// // //     const min = String(date.getMinutes()).padStart(2, "0");
// // //     return `${mm}-${dd}-${yyyy} ${hh}:${min}`;
// // //   };

// // //   useEffect(() => {
// // //     const fetchChatsAndMessages = async () => {
// // //       const res = await fetch(
// // //         "https://cloud.b2b-accelerator.com/webhook/ee8a52a6-1e0b-4995-8008-d910ea232ebe",
// // //         { method: "POST" }
// // //       );
// // //       const data = await res.json();

// // //       console.log("data is");
// // //       console.log(data);
// // //       const allMessages: Message[] = [];
// // //       const chatMap: Record<string, Chat> = {};

// // //       data.forEach((ml: any) => {
// // //         ml.items.forEach((m: any) => {
// // //           // Flatten messages
// // //           allMessages.push({
// // //             id: m.id,
// // //             chatId: m.chat_id,
// // //             text: m.text,
// // //             timestamp: m.timestamp,
// // //             sent: m.is_sender === 1,
// // //             attachments: m.attachments || [],
// // //           });

// // //           // Create or update chat
// // //           if (!chatMap[m.chat_id]) {
// // //             chatMap[m.chat_id] = {
// // //               id: m.chat_id,
// // //               name: m.attendee_provider_id?.slice(0, 2).toUpperCase() || "??",
// // //               avatar: m.attendee_provider_id?.slice(0, 2).toUpperCase() || "??",
// // //               lastMessage: m.text || "",
// // //               timestamp: m.timestamp,
// // //               unread: m.seen === 0 ? 1 : 0,
// // //               online: true,
// // //             };
// // //           } else {
// // //             const currentLast = new Date(
// // //               chatMap[m.chat_id].timestamp
// // //             ).getTime();
// // //             const newMsg = new Date(m.timestamp).getTime();
// // //             if (newMsg > currentLast) {
// // //               chatMap[m.chat_id].lastMessage = m.text || "";
// // //               chatMap[m.chat_id].timestamp = m.timestamp;
// // //               chatMap[m.chat_id].unread =
// // //                 m.seen === 0 ? 1 : chatMap[m.chat_id].unread;
// // //             }
// // //           }
// // //         });
// // //       });

// // //       // Sort chats by latest timestamp
// // //       setChats(
// // //         Object.values(chatMap).sort(
// // //           (a, b) =>
// // //             new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
// // //         )
// // //       );

// // //       // Group messages by chatId
// // //       const messagesByChat: Record<string, Message[]> = {};
// // //       allMessages.forEach((msg) => {
// // //         if (!messagesByChat[msg.chatId]) messagesByChat[msg.chatId] = [];
// // //         messagesByChat[msg.chatId].push(msg);
// // //       });
// // //       setMessages(messagesByChat);

// // //       if (Object.keys(chatMap).length) setActiveChat(Object.keys(chatMap)[0]);
// // //     };

// // //     fetchChatsAndMessages();
// // //   }, []);

// // //   const activeMessages = activeChat ? messages[activeChat] || [] : [];
// // //   const activeChatData = chats.find((c) => c.id === activeChat) || null;

// // //   // Format timestamps for sidebar
// // //   const chatsWithFormattedTime = chats.map((c) => ({
// // //     ...c,
// // //     timestamp: formatTimestamp(c.timestamp),
// // //   }));

// // //   return (
// // //     <div className="flex h-screen bg-background">
// // //       <div className="w-[380px] flex-shrink-0">
// // //         <ChatSidebar
// // //           chats={chatsWithFormattedTime}
// // //           activeChat={activeChat}
// // //           onSelectChat={setActiveChat}
// // //           searchQuery={searchQuery}
// // //           onSearchChange={setSearchQuery}
// // //         />
// // //       </div>
// // //       <ChatWindow chat={activeChatData} messages={activeMessages} />
// // //     </div>
// // //   );
// // // };

// // // export default Index;
// // // // import { useState, useEffect } from "react";
// // // // import ChatSidebar from "@/components/ChatSidebar";
// // // // import ChatWindow from "@/components/ChatWindow";

// // // // export interface Chat {
// // // //   id: string;
// // // //   name: string;
// // // //   avatar: string;
// // // //   lastMessage: string;
// // // //   timestamp: string;
// // // //   unread: number;
// // // //   online: boolean;
// // // // }

// // // // export interface Message {
// // // //   id: string;
// // // //   chatId: string;
// // // //   text: string;
// // // //   timestamp: string;
// // // //   sent: boolean;
// // // //   attachments?: any[];
// // // // }

// // // // const Index = () => {
// // // //   const [chats, setChats] = useState<Chat[]>([]);
// // // //   const [messages, setMessages] = useState<Record<string, Message[]>>({});
// // // //   const [activeChat, setActiveChat] = useState<string | null>(null);
// // // //   const [searchQuery, setSearchQuery] = useState("");

// // // //   // Fetch chats + messages from n8n webhook
// // // //   useEffect(() => {
// // // //     const fetchChatsAndMessages = async () => {
// // // //       const res = await fetch(
// // // //         "https://cloud.b2b-accelerator.com/webhook/ee8a52a6-1e0b-4995-8008-d910ea232ebe",
// // // //         { method: "POST" }
// // // //       );
// // // //       const data = await res.json();

// // // //       // Flatten all messages
// // // //       const allMessages: Message[] = [];
// // // //       const chatMap: Record<string, Chat> = {};

// // // //       data.forEach((ml: any) => {
// // // //         ml.items.forEach((m: any) => {
// // // //           // Create chat if not exists
// // // //           if (!chatMap[m.chat_id]) {
// // // //             chatMap[m.chat_id] = {
// // // //               id: m.chat_id,
// // // //               name: m.attendee_provider_id?.slice(0, 2).toUpperCase() || "??",
// // // //               avatar: m.attendee_provider_id?.slice(0, 2).toUpperCase() || "??",
// // // //               lastMessage: m.text || "",
// // // //               timestamp: m.timestamp,
// // // //               unread: m.seen === 0 ? 1 : 0,
// // // //               online: true,
// // // //             };
// // // //           }

// // // //           allMessages.push({
// // // //             id: m.id,
// // // //             chatId: m.chat_id,
// // // //             text: m.text,
// // // //             timestamp: m.timestamp,
// // // //             sent: m.is_sender === 1,
// // // //             attachments: m.attachments || [],
// // // //           });
// // // //         });
// // // //       });

// // // //       setChats(Object.values(chatMap));

// // // //       // Group messages by chat_id
// // // //       const messagesByChat: Record<string, Message[]> = {};
// // // //       allMessages.forEach((msg) => {
// // // //         if (!messagesByChat[msg.chatId]) messagesByChat[msg.chatId] = [];
// // // //         messagesByChat[msg.chatId].push(msg);
// // // //       });

// // // //       setMessages(messagesByChat);

// // // //       if (Object.keys(chatMap).length) setActiveChat(Object.keys(chatMap)[0]);
// // // //     };

// // // //     fetchChatsAndMessages();
// // // //   }, []);

// // // //   const activeMessages = activeChat ? messages[activeChat] || [] : [];
// // // //   const activeChatData = chats.find((c) => c.id === activeChat) || null;

// // // //   return (
// // // //     <div className="flex h-screen bg-background">
// // // //       <div className="w-[380px] flex-shrink-0">
// // // //         <ChatSidebar
// // // //           chats={chats}
// // // //           activeChat={activeChat}
// // // //           onSelectChat={setActiveChat}
// // // //           searchQuery={searchQuery}
// // // //           onSearchChange={setSearchQuery}
// // // //         />
// // // //       </div>
// // // //       <ChatWindow chat={activeChatData} messages={activeMessages} />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Index;

// // // // // import { useState } from "react";
// // // // // import ChatSidebar from "@/components/ChatSidebar";
// // // // // import ChatWindow from "@/components/ChatWindow";
// // // // // import { mockChats, mockMessages } from "@/data/chatData";

// // // // // const Index = () => {
// // // // //   const [activeChat, setActiveChat] = useState<string | null>("1");
// // // // //   const [searchQuery, setSearchQuery] = useState("");

// // // // //   const activeMessages = activeChat ? mockMessages[activeChat] || [] : [];
// // // // //   const activeChatData = mockChats.find((c) => c.id === activeChat) || null;

// // // // //   return (
// // // // //     <div className="flex h-screen bg-background">
// // // // //       <div className="w-[380px] flex-shrink-0">
// // // // //         <ChatSidebar
// // // // //           chats={mockChats}
// // // // //           activeChat={activeChat}
// // // // //           onSelectChat={setActiveChat}
// // // // //           searchQuery={searchQuery}
// // // // //           onSearchChange={setSearchQuery}
// // // // //         />
// // // // //       </div>
// // // // //       <ChatWindow chat={activeChatData} messages={activeMessages} />
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Index;
