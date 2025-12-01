import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Send, UserCircle2 } from "lucide-react";
import AdminLayout from "../AdminLayout";

// BASE URL from .env
const API = process.env.REACT_APP_API_URL;

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const admin = JSON.parse(localStorage.getItem("user")); // logged-in admin

  /* ------------------------------ LOAD TICKETS ------------------------------ */
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/support/tickets`);
        setTickets(res.data);
      } catch (err) {
        console.error("TICKET LOAD ERROR:", err);
      }
    };

    loadTickets();
  }, []);

  /* ----------------------------- OPEN TICKET ----------------------------- */
  const openTicket = async (t) => {
    setSelectedTicket(t);

    try {
      const res = await axios.get(`${API}/api/admin/support/messages/${t.id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("MESSAGE LOAD ERROR:", err);
    }
  };

  /* ------------------------------ SEND MESSAGE ------------------------------ */
  const handleSend = async () => {
    if (!message.trim()) return;

    const newMsg = { sender: "admin", text: message };
    setMessages((prev) => [...prev, newMsg]); // Instant UI update

    try {
      await axios.post(`${API}/api/admin/support/send-message`, {
        ticket_id: selectedTicket.id,
        admin_id: admin.id,
        message,
      });
    } catch (err) {
      console.error("SEND ERROR:", err);
    }

    setMessage("");
  };

  return (
    <AdminLayout>
      <div className="h-screen flex bg-gray-50">

        {/* =====================================================
                        LEFT SIDEBAR — TICKET LIST
        ===================================================== */}
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
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => openTicket(t)}
                className={`px-4 py-3 cursor-pointer border-b hover:bg-gray-100 transition
                  ${selectedTicket?.id === t.id ? "bg-gray-100" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 grid place-content-center">
                    <UserCircle2 className="w-7 h-7 text-gray-500" />
                  </div>

                  <div>
                    <p className="font-semibold text-[#0e2340]">{t.name}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {t.latest_message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
                      MIDDLE AREA — CHAT WINDOW
        ===================================================== */}
        <div className="flex-1 flex flex-col">
          {!selectedTicket ? (
            <div className="flex flex-1 items-center justify-center text-gray-400">
              Select a conversation
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b bg-white">
                <h2 className="font-semibold text-[#0e2340] text-lg">
                  {selectedTicket.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedTicket.email}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg, i) => (
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

              {/* Input Bar */}
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

        {/* =====================================================
                       RIGHT PANEL — USER DETAILS
        ===================================================== */}
        {selectedTicket && (
          <div className="w-80 border-l bg-white p-4">
            <h3 className="text-lg font-bold text-[#0e2340] mb-2">
              User Details
            </h3>

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {selectedTicket.name}
              </p>

              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedTicket.email}
              </p>

              <p>
                <span className="font-semibold">Subject:</span>{" "}
                {selectedTicket.subject}
              </p>

              <textarea
                className="w-full h-24 border rounded-xl p-2 text-sm"
                placeholder="Admin notes..."
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
