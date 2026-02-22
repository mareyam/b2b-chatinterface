import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Chat, Message } from "@/data/chatData";

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  loading: boolean;
}

const ChatWindow = ({ chat, messages, loading }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${mm}-${dd}-${yyyy} ${hh}:${min}`;
  };

  // No chat selected
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-bg">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-20 h-20 text-primary/30" />
          </div>
          <h2 className="text-2xl font-light text-muted-foreground">
            Chat Interface
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Select a chat to get messages
          </p>
        </div>
      </div>
    );
  }

  const initials = chat.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 bg-chat-header border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-semibold text-primary-foreground">
          {initials}
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-primary-foreground text-sm">
            {chat.name}
          </span>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center bg-chat-bg">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div
          className="flex-1 overflow-y-auto px-16 py-4 space-y-2"
          style={{ backgroundColor: "hsl(var(--chat-bg))" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[65%] px-3 py-1.5 rounded-lg text-sm ${
                  msg.sent
                    ? "bg-chat-bubble-sent rounded-tr-none"
                    : "bg-chat-bubble-received rounded-tl-none"
                }`}
                style={{ boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}
              >
                <span>{msg.text}</span>

                <span className="text-[11px] text-chat-timestamp ml-3 float-right mt-1">
                  {formatTimestamp(msg.timestamp)}
                  {msg.sent && (
                    <span
                      className="ml-1"
                      style={{ color: "hsl(210, 80%, 55%)" }}
                    >
                      ✓✓
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
// import { useRef, useEffect } from "react";
// import { MessageSquare } from "lucide-react";
// import { Chat, Message } from "@/data/chatData";

// interface ChatWindowProps {
//   chat: Chat | null;
//   messages: Message[];
// }

// const ChatWindow = ({ chat, messages }: ChatWindowProps) => {
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const formatTimestamp = (timestamp: string) => {
//     const date = new Date(timestamp);
//     const mm = String(date.getMonth() + 1).padStart(2, "0");
//     const dd = String(date.getDate()).padStart(2, "0");
//     const yyyy = date.getFullYear();
//     const hh = String(date.getHours()).padStart(2, "0");
//     const min = String(date.getMinutes()).padStart(2, "0");

//     return `${mm}-${dd}-${yyyy} ${hh}:${min}`;
//   };

//   if (!chat) {
//     return (
//       <div className="flex-1 flex items-center justify-center bg-chat-bg">
//         <div className="text-center">
//           <div className="w-64 h-64 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
//             <MessageSquare className="w-20 h-20 text-primary/30" />
//           </div>
//           <h2 className="text-2xl font-light text-muted-foreground">
//             Chat Interface
//           </h2>
//           <p className="text-sm text-muted-foreground mt-2">
//             Select a chat to get messages
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const initials = chat.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   return (
//     <div className="flex-1 flex flex-col h-full">
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-3 bg-chat-header border-b border-border">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-semibold text-primary-foreground">
//             {initials}
//           </div>

//           <div className="flex flex-col">
//             <span className="font-semibold text-primary-foreground text-sm">
//               {chat.name}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div
//         className="flex-1 overflow-y-auto px-16 py-4 space-y-2"
//         style={{ backgroundColor: "hsl(var(--chat-bg))" }}
//       >
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`max-w-[65%] px-3 py-1.5 rounded-lg text-sm relative ${
//                 msg.sent
//                   ? "bg-chat-bubble-sent text-foreground rounded-tr-none"
//                   : "bg-chat-bubble-received text-foreground rounded-tl-none"
//               }`}
//               style={{ boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}
//             >
//               <span>{msg.text}</span>

//               <span className="text-[11px] text-chat-timestamp ml-3 float-right mt-1">
//                 {formatTimestamp(msg.timestamp)}
//                 {msg.sent && (
//                   <span
//                     className="ml-1"
//                     style={{ color: "hsl(210, 80%, 55%)" }}
//                   >
//                     ✓✓
//                   </span>
//                 )}
//               </span>
//             </div>
//           </div>
//         ))}

//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;
