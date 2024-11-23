"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [messages, setMessages] = useState([
    { text: "Hey there, what can I help you with?", isBot: true },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userInput.trim() === "") return;

    const newMessages = [...messages, { text: userInput, isBot: false }];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.reply, isBot: true }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Please try again.", isBot: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", updatePosition);
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return (
    <div>
      {/* Chatbox container */}
      <div
        className={`omnivoxorange fixed z-30 right-3 bottom-0 grid w-80 border border-omnivoxorange shadow-2xl transition-all duration-300 rounded-t-lg ${
          isOpen
            ? "grid-rows-[min-content_1fr_min-content] h-96"
            : "grid-rows-[min-content] h-12"
        } ${
          scrollPosition > 10
            ? "bg-omnivoxorange/30 backdrop-blur-xl"
            : "bg-omnivoxorange"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2">
          <p className="text-white text-sm">Ask your questions</p>
          <button
            onClick={toggleChatbox}
            aria-label="menu"
            className="ml-auto text-white bg-transparent border rounded-full w-6 h-6 flex items-center justify-center hover:bg-white hover:text-omnivoxorange"
          >
            {isOpen ? "−" : "+"}
          </button>
        </div>

        {/* Scrollable chat messages */}
        {isOpen && (
          <div className="overflow-y-auto p-4 space-y-3 flex flex-col">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[90%] break-words ${
                  msg.isBot
                    ? "bg-gray-200 text-gray-800 self-start" // Bot messages aligned to the left
                    : "bg-blue-500 text-white self-end" // User messages aligned to the right
                }`}
                style={{
                  alignSelf: msg.isBot ? "flex-start" : "flex-end", // Explicit alignment
                }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 bg-gray-200 text-gray-800 rounded-lg self-start max-w-[90%]">
                Typing...
              </div>
            )}
          </div>
        )}

        {/* Input area */}
        {isOpen && (
          <div className="border-t p-2 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                name="message"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-omnivoxorange text-white p-2 rounded-r-lg"
                disabled={isLoading}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
