import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function FAQChatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 I'm your NeuroFlex Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const faqs = {
    "what is neuro flex mat":
      "Neuro Flex Mat is an intelligent physiotherapy mat that tracks reflex and pressure data using piezoelectric sensors connected to ESP32, helping in patient rehabilitation.",
    "how does it work":
      "The mat detects foot pressure using sensors, processes the data in real-time, and visualizes it on a dashboard for doctors and patients.",
    "what sensors are used":
      "Piezoelectric sensors are used to detect pressure variations, connected to an ESP32 microcontroller.",
    "can it connect to mobile app":
      "Yes! Neuro Flex Mat connects via Bluetooth/WiFi to the mobile app for real-time monitoring and analysis.",
    "who can use it":
      "It’s designed for physiotherapists, rehabilitation centers, and patients undergoing motor skill recovery.",
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    const reply = getBotReply(input);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 600);

    setInput("");
  };

  const getBotReply = (inputText) => {
    const lower = inputText.toLowerCase();
    for (let key in faqs) {
      if (lower.includes(key)) {
        return faqs[key];
      }
    }
    return "I'm not sure about that 🤔 — but you can check the Neuro Flex documentation or contact our support team!";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffdfd]">
      <motion.div
        className="w-full max-w-md bg-[#293132] text-[#fffdfd] rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="bg-[#28afb0] p-4 text-center text-lg font-semibold tracking-wide">
          NeuroFlex FAQ Chatbot 💬
        </div>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-[#28afb0] text-white rounded-br-none"
                    : "bg-[#fffdfd] text-[#293132] rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex items-center p-3 border-t border-gray-600 bg-[#293132]">
          <input
            type="text"
            className="flex-grow bg-transparent border-none outline-none text-[#fffdfd] placeholder-gray-400 p-2"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-[#28afb0] hover:bg-[#22a1a2] transition-all p-2 rounded-full"
          >
            <Send className="text-white w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
