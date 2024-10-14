import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css";
import ChatHistory from "./component/ChatHistory";
import Loading from "./component/Loading";
import { useData } from "./Context/DataProvider";
import GaussianNoise from "./component/GaussianNoise";
import logo from "./logo.png"; // Import logo
import Decoder from "./component/decoder";
const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { state, setState } = useData();
  const inputRef = useRef(); // To handle input without updating state on every keystroke

  // Initialize your Gemini API
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Function to send user message to Gemini when clicking the button
  const sendMessage = async () => {
    const userInput = inputRef.current.value; // Get the value from the input field without state updates

    if (userInput.trim() === "") return; // Do nothing if the input is empty

    setIsLoading(true);
    try {
      // Call Gemini API to get a response
      const result = await model.generateContent(
        `Act like a semantic encoder and summarize the core meaning of the following sentence in a shorter, meaningful way. If the original message includes emotional or intentional qualities, preserve them; otherwise, focus solely on conveying the precise meaning: ${userInput}`
      );
      const response = await result.response;

      // Add Gemini's response to the chat history
      setState((prevState) => ({
        ...prevState,
        index: prevState.index + 1,
        list: [...prevState.list, { chat: response.text(), ind: prevState.index + 1, input: userInput }]
      }));

      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput, index: state.index + 1 },
        { type: "bot", message: response.text(), index: state.index + 1 }
      ]);

    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      inputRef.current.value = ""; // Clear input field after sending
      setIsLoading(false); // Stop loading state
    }
  };

  // Function to clear the chat history
  const clearChat = () => {
    setState((prevState) => ({
      ...prevState,
      select: -1
    }));
    setChatHistory([]);
  };

  // Function to call the plotting API
  const plotData = async () => {
    setIsLoading(true); // Start loading before the fetch
    try {
      const response = await fetch("https://semantic-communication.onrender.com/plot-similarity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.SimilarityData), // Send your list from state to the API
      });

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      // Open the image in a new tab
      window.open(imageUrl, "_blank");

      // Alternatively, download the image
      // const a = document.createElement("a");
      // a.href = imageUrl;
      // a.download = "similarity_plot.png";
      // a.click();
      
    } catch (error) {
      console.error("Error plotting data:", error);
    } finally {
      setIsLoading(false); // Stop loading after the fetch completes
    }
  };

  useEffect(() => {
    // Any side effects based on `state` can go here
  }, [state]);

  console.log(state);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <img src={logo} alt="Logo" className="h-10 mr-4" /> {/* Logo at top left */}
          <div>
            <h1 className="text-3xl font-bold">Semantic Communication System</h1>
          </div>
        </div>

        <div className="flex mt-4">
          <input
            type="text"
            ref={inputRef} // Using ref to handle the input value
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            className="px-4 py-2 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
            onClick={sendMessage}
            disabled={isLoading}
          >
            Extract Meaning
          </button>
        </div>
        <div className="flex mt-4 space-x-2">
          <button
            className="block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
            onClick={clearChat}
          >
            Clear
          </button>
          <button
            className="block px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none"
            onClick={plotData} style={{ backgroundColor: state.SimilarityData.length ? "#22C55E" : "#9CA3AF" }}
          >
            Plot Data
          </button>
        </div>
      </div>
      <div className="chat-container rounded-lg shadow-md p-4">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <Decoder />
    </>
  );
};

export default App;
