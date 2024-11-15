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
  const pathName = usePathname();

  // Handles opening and closing of the chatbox
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Handles sending a message
  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (userInput.trim() !== "") {
      setMessages([...messages, { text: userInput, isBot: false }]);
      setUserInput("");
    }
  };

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", updatePosition);
    updatePosition();
  }, []);

  return (
    <div>
      {/* Chatbox container */}
      <div
        className={`omnivoxorange fixed z-30 right-3 bottom-0 flex w-80 flex-col border border-omnivoxorange shadow-2xl transition duration-300 rounded-t-lg ${
          isOpen ? "h-96" : "h-12"
        } ${
          scrollPosition > 10
            ? "bg-omnivoxorange/30 backdrop-blur-xl"
            : "bg-omnivoxorange"
        }`}
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between p-4">
          <p className="text-white">Ask your questions</p>
          <button
            onClick={handleClick}
            aria-label="menu"
            className="ml-auto text-white"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Chat content */}
        {isOpen && (
          <div className="flex flex-col h-full">
            {/* Scrollable chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[90%] ${
                    msg.isBot
                      ? "bg-gray-200 text-gray-800 self-start" // Bot messages aligned to the left
                      : "bg-blue-500 text-white self-end" // User messages aligned to the right
                  }`}
                  style={{
                    alignSelf: msg.isBot ? "flex-start" : "flex-end", // Ensure alignment
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input area fixed at the bottom */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center border-t p-2 bg-white"
            >
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
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
