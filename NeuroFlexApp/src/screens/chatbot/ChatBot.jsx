import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const scrollRef = useRef();
  const { width } = useWindowDimensions();
  const controllerRef = useRef(null);

  // ✅ Gemini
  const API_KEY = "AIzaSyBPhI2LOjmQy819BP8xSplsoo1gFT8bCZY";
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    API_KEY;

  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => scrollToBottom(), [messages, streamingText]);

  const safeHTML = (text) => {
    const esc = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<div style="color:#000;font-size:15px;line-height:20px;">${esc}</div>`;
  };

  const removeMarkdown = (text) => {
    return text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/#+\s/g, "")
      .replace(/-\s/g, "")
      .replace(/>\s/g, "")
      .trim();
  };

  // ✅ SEND FAQ or User text
  const sendMessage = async (preText) => {
    const finalText = preText || input.trim();
    if (!finalText || sending) return;

    setMessages((prev) => [...prev, { sender: "user", text: finalText }]);
    setInput("");
    setSending(true);
    setStreamingText("");

    controllerRef.current = new AbortController();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        signal: controllerRef.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: finalText + " Give short answer in 30 words" }],
            },
          ],
        }),
      });

      const data = await res.json();

      const rawBotText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response";

      const botText = removeMarkdown(rawBotText);

      // ✅ typing effect
      const words = botText.split(" ");
      let index = 0;

      const typing = setInterval(() => {
        setStreamingText((prev) => prev + words[index] + " ");
        index++;

        if (index >= words.length) {
          clearInterval(typing);
          setStreamingText("");
          setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
          setSending(false);
        }
      }, 25);
    } catch (error) {
      if (error.name === "AbortError") {
        setMessages((prev) => [...prev, { sender: "bot", text: "❌ Cancelled" }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: "❌ API error" }]);
      }
      setSending(false);
    }
  };

  const cancelRequest = () => {
    controllerRef.current?.abort();
    setSending(false);
    setStreamingText("");
  };

  // ✅ FAQ list
  const faqs = [
    "What are common symptoms of fever?",
    "How can I boost my immunity naturally?",
    "What is the best time to workout?",
    "How many steps should I walk daily?",
  ];

  return (
    <SafeAreaView style={styles.page}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Neuro Assistant</Text>

        {sending ? (
          <TouchableOpacity onPress={cancelRequest}>
            <Text style={styles.stopBtn}>⏹</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 30 }} />
        )}
      </View>

      {/* ✅ FAQ BUTTONS */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 10 }}>
        {faqs.map((q, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => sendMessage(q)}
            style={{
              backgroundColor: "#E8E8E8",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              margin: 5,
            }}
          >
            <Text style={{ color: "#000", fontSize: 13 }}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ Chat Area */}
      <ScrollView ref={scrollRef} style={styles.chatArea}>
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              msg.sender === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <RenderHTML
              contentWidth={width - 70}
              source={{ html: safeHTML(msg.text) }}
            />
          </View>
        ))}

        {!!streamingText && (
          <View style={[styles.bubble, styles.botBubble]}>
            <RenderHTML
              contentWidth={width - 70}
              source={{ html: safeHTML(streamingText) }}
            />
          </View>
        )}

        {sending && !streamingText && (
          <Text style={styles.thinking}>Thinking...</Text>
        )}
      </ScrollView>

      {/* ✅ Improved KeyboardAvoiding */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
      >
        <View style={styles.inputArea}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#777"
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={sending}
            style={styles.sendBtn}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 20 }}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ✅ Same styles (unchanged)
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    backgroundColor: "#28AFB0",
    padding: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginVertical: 5,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  stopBtn: { fontSize: 22, color: "white" },
  chatArea: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  bubble: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
    maxWidth: "85%",
  },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  botBubble: { alignSelf: "flex-start", backgroundColor: "#E8E8E8" },
  thinking: {
    textAlign: "center",
    color: "#444",
    marginVertical: 4,
    fontStyle: "italic",
  },
  inputArea: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sendBtn: {
    backgroundColor: "#28AFB0",
    width: 48,
    height: 48,
    marginLeft: 10,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
