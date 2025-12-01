import React, { useState, useEffect } from "react";
import axios from "axios";
import { Send, MessageCircle, Mail } from "lucide-react";

// Correct frontend env variable
const API = process.env.REACT_APP_API_URL;

export default function UsersSupport() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [ticketId, setTicketId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⬅️ Correct key (your AuthContext uses "hsUser")
  const user = JSON.parse(localStorage.getItem("hsUser"));
  const userId = user?.id || null;

  /** ✅ Always call hook — never conditionally */
  useEffect(() => {
    const loadTicket = async () => {
      // If not logged in → show message but do not break the component
      if (!userId) {
        setMessages([
          { sender: "bot", text: "Please login to start a support conversation." }
        ]);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/api/support/user/${userId}`);

        if (res.data.ticket) {
          setTicketId(res.data.ticket.id);
          setMessages(res.data.messages);
        } else {
          setMessages([
            { sender: "bot", text: "Hi! 👋 How can we support you today?" }
          ]);
        }
      } catch (err) {
        console.error("LOAD ERROR:", err);
      }

      setLoading(false);
    };

    loadTicket();
  }, [userId]);

  /** SEND MESSAGE **/
  const handleSend = async () => {
    if (!input.trim()) return;

    if (!userId) {
      alert("Please login to send messages.");
      return;
    }

    const newMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);

    const text = input;
    setInput("");

    try {
      let tid = ticketId;

      // No ticket → create it
      if (!tid) {
        const create = await axios.post(`${API}/api/support/create-ticket`, {
          user_id: userId,
          subject: "User Support Request",
          first_message: text,
        });

        tid = create.data.ticket_id;
        setTicketId(tid);
      }

      // Send message to backend
      await axios.post(`${API}/api/support/send-message`, {
        ticket_id: tid,
        sender_type: "user",
        sender_id: userId,
        message: text,
      });

    } catch (err) {
      console.error("SEND ERROR:", err);
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading chat…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f3f9ff] to-[#eef5ff] px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#12263a]">We’re Here to Help 💛</h1>
          <p className="text-gray-600 mt-2">
            Contact our team anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT BAR */}
          <div className="bg-white/80 p-5 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-[#0e2340] mb-3">Email Support</h3>
            <p className="text-gray-600 text-sm">Prefer email? We reply within 24 hours.</p>

            <a
              href="mailto:support@hopespring.ca"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0e2340] text-white font-semibold shadow hover:brightness-110 transition"
            >
              <Mail size={18} /> Email Us
            </a>
          </div>

          {/* CHAT WINDOW */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl border flex flex-col h-[600px]">

            <div className="p-4 border-b bg-[#0e2340] text-white rounded-t-xl flex items-center gap-2">
              <MessageCircle /> HopeSpring Support Chat
            </div>

            {/* CHAT MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      msg.sender === "user"
                        ? "bg-[#0e2340] text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT AREA */}
            <div className="p-4 border-t flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-xl border"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-[#0e2340] text-white rounded-xl shadow flex items-center gap-1"
              >
                <Send size={18} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
