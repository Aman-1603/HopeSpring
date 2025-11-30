import React, { useState } from "react";
import { Search, Send, Loader2, UserCircle2 } from "lucide-react";

export default function AdminSupport() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  const users = [
    {
      id: 1,
      name: "John Carter",
      email: "john@example.com",
      lastMessage: "I need help with program booking",
      category: "Programs",
      avatar: "",
    },
    {
      id: 2,
      name: "Emily Brown",
      email: "emily@example.com",
      lastMessage: "Donation receipt not received",
      category: "Donations",
      avatar: "",
    },
    {
      id: 3,
      name: "Michael Davis",
      email: "mike@example.com",
      lastMessage: "I can’t log into my account",
      category: "Technical",
      avatar: "",
    },
  ];

  const messages = {
    1: [
      { sender: "user", text: "I need help with program booking" },
      { sender: "bot", text: "Sure! What issue are you facing?" },
    ],
    2: [
      { sender: "user", text: "I didn’t receive my donation receipt" },
      { sender: "bot", text: "I can help you with that!" },
    ],
    3: [
      { sender: "user", text: "I can’t log into my account" },
    ],
  };

  const handleSend = () => {
    if (!message.trim()) return;

    messages[selectedUser.id].push({ sender: "admin", text: message });
    setMessage("");
  };

  return (
    <div className="h-screen flex bg-gray-50">

      {/* LEFT SIDEBAR — User List */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-[#0e2340]">Support Inbox</h2>
          <div className="mt-3 relative">
            <input
              className="w-full rounded-xl border px-4 py-2 pr-10 text-sm"
              placeholder="Search users..."
            />
            <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`px-4 py-3 cursor-pointer border-b hover:bg-gray-100 transition 
              ${selectedUser?.id === u.id ? "bg-gray-100" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 grid place-content-center">
                  <UserCircle2 className="w-7 h-7 text-gray-500" />
                </div>

                <div>
                  <p className="font-semibold text-[#0e2340]">{u.name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {u.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE — Chat Window */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Select a user to view conversation
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b bg-white">
              <h2 className="font-semibold text-[#0e2340] text-lg">
                {selectedUser.name}
              </h2>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages[selectedUser.id].map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl text-sm shadow 
                    ${
                      msg.sender === "user"
                        ? "bg-white border text-gray-800 rounded-bl-none"
                        : "bg-[#0e2340] text-white rounded-br-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white flex gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-2 border rounded-xl"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="px-4 py-2 bg-[#0e2340] text-white rounded-xl shadow hover:brightness-110 transition flex items-center gap-1"
                onClick={handleSend}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* RIGHT PANEL — User Info */}
      {selectedUser && (
        <div className="w-80 border-l bg-white p-4">
          <h3 className="text-lg font-bold text-[#0e2340] mb-2">User Details</h3>

          <div className="space-y-3 text-sm">
            <p>
              <span className="font-semibold">Name:</span> {selectedUser.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {selectedUser.email}
            </p>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {selectedUser.category}
            </p>

            <textarea
              className="w-full h-24 border rounded-xl p-2 text-sm"
              placeholder="Admin notes..."
            ></textarea>
          </div>
        </div>
      )}
    </div>
  );
}
