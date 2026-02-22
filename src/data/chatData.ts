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
}

export const mockChats: Chat[] = [
  { id: "1", name: "Alice Johnson", avatar: "AJ", lastMessage: "Hey! How are you doing?", timestamp: "10:30 AM", unread: 2, online: true },
  { id: "2", name: "Bob Smith", avatar: "BS", lastMessage: "Let's meet tomorrow 🍕", timestamp: "9:15 AM", unread: 0, online: false },
  { id: "3", name: "Work Group", avatar: "WG", lastMessage: "David: Meeting at 3pm", timestamp: "Yesterday", unread: 5, online: false },
  { id: "4", name: "Charlie Davis", avatar: "CD", lastMessage: "Thanks for the help!", timestamp: "Yesterday", unread: 0, online: true },
  { id: "5", name: "Diana Prince", avatar: "DP", lastMessage: "See you at the event!", timestamp: "Monday", unread: 0, online: false },
  { id: "6", name: "Family Group", avatar: "FG", lastMessage: "Mom: Dinner on Sunday?", timestamp: "Monday", unread: 1, online: false },
  { id: "7", name: "Eve Martinez", avatar: "EM", lastMessage: "That's awesome! 🎉", timestamp: "Sunday", unread: 0, online: true },
  { id: "8", name: "Frank Wilson", avatar: "FW", lastMessage: "Can you send the file?", timestamp: "Saturday", unread: 0, online: false },
];

export const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", chatId: "1", text: "Hi Alice! Long time no see 😊", timestamp: "10:15 AM", sent: true },
    { id: "m2", chatId: "1", text: "Hey! How are you doing?", timestamp: "10:30 AM", sent: false },
    { id: "m3", chatId: "1", text: "I've been great! Just got back from vacation", timestamp: "10:31 AM", sent: false },
    { id: "m4", chatId: "1", text: "Oh nice! Where did you go?", timestamp: "10:32 AM", sent: true },
    { id: "m5", chatId: "1", text: "Went to Bali! It was amazing 🌴", timestamp: "10:33 AM", sent: false },
    { id: "m6", chatId: "1", text: "That sounds incredible! Show me photos sometime", timestamp: "10:34 AM", sent: true },
  ],
  "2": [
    { id: "m7", chatId: "2", text: "Hey Bob, free tomorrow?", timestamp: "9:00 AM", sent: true },
    { id: "m8", chatId: "2", text: "Let's meet tomorrow 🍕", timestamp: "9:15 AM", sent: false },
  ],
  "3": [
    { id: "m9", chatId: "3", text: "Agenda for today's meeting?", timestamp: "2:00 PM", sent: true },
    { id: "m10", chatId: "3", text: "David: Meeting at 3pm", timestamp: "2:30 PM", sent: false },
    { id: "m11", chatId: "3", text: "Sarah: I'll prepare the slides", timestamp: "2:45 PM", sent: false },
    { id: "m12", chatId: "3", text: "Great, see everyone there!", timestamp: "2:50 PM", sent: true },
  ],
  "4": [
    { id: "m13", chatId: "4", text: "Hey Charlie, I fixed the bug in the codebase", timestamp: "3:00 PM", sent: true },
    { id: "m14", chatId: "4", text: "Thanks for the help!", timestamp: "3:10 PM", sent: false },
  ],
  "5": [
    { id: "m15", chatId: "5", text: "Are you going to the tech meetup?", timestamp: "11:00 AM", sent: true },
    { id: "m16", chatId: "5", text: "See you at the event!", timestamp: "11:30 AM", sent: false },
  ],
  "6": [
    { id: "m17", chatId: "6", text: "Mom: Dinner on Sunday?", timestamp: "6:00 PM", sent: false },
  ],
  "7": [
    { id: "m18", chatId: "7", text: "I got promoted! 🎊", timestamp: "4:00 PM", sent: true },
    { id: "m19", chatId: "7", text: "That's awesome! 🎉", timestamp: "4:05 PM", sent: false },
  ],
  "8": [
    { id: "m20", chatId: "8", text: "Can you send the file?", timestamp: "10:00 AM", sent: false },
  ],
};
