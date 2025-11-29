import React, { useState } from "react";
import { Send, Loader2, MessageCircle, HelpCircle, Mail } from "lucide-react";

export default function UsersSupport() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 How can we support you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const recommendedTopics = [
    "Programs & Registration",
    "Billing or Donation Help",
    "Counselling & Support",
    "Technical Issue",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Typing animation
    setIsTyping(true);

    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: "Thank you for your message! A HopeSpring support member will respond shortly.",
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f3f9ff] to-[#eef5ff] px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#12263a]">
            We’re Here to Help 💛
          </h1>
          <p className="text-gray-600 mt-2">
            Contact our support team for programs, counselling, technical help, or donations.
          </p>
        </div>

        {/* Support Layout */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Left Sidebar */}
          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-[#0e2340] mb-3">Quick Topics</h3>

            <div className="flex flex-col gap-3">
              {recommendedTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() =>
                    setMessages((prev) => [
                      ...prev,
                      { sender: "user", text: topic },
                      {
                        sender: "bot",
                        text: `Sure! I can help with "${topic}". A team member will reach out shortly.`,
                      },
                    ])
                  }
                  className="w-full text-left px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-gray-700 font-medium transition"
                >
                  {topic}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-[#0e2340]">Email Support</h3>
              <p className="text-gray-600 text-sm mt-1">
                Prefer email? We usually respond within 24 hours.
              </p>

              <a
                href="mailto:support@hopespring.ca"
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0e2340] text-white font-semibold shadow hover:brightness-110 transition"
              >
                <Mail size={18} /> Email Us
              </a>
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col h-[600px]">

            {/* Chat Header */}
            <div className="p-4 border-b bg-[#0e2340] text-white rounded-t-2xl flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-lg font-semibold">HopeSpring Support Chat</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
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

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 bg-gray-100 rounded-2xl text-gray-500 text-xs flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce delay-150">•</span>
                    <span className="animate-bounce delay-300">•</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="p-4 border-t flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-[#0e2340] text-white rounded-xl shadow hover:brightness-110 transition flex items-center gap-1"
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
