import React, { useState, useEffect } from "react";
import GaussianNoise from "./GaussianNoise";
import { useData } from "../Context/DataProvider";
import Loading from "./Loading"; // Import the Loading component

const API_KEY = "sk-hiHbfAjaSmALTocXNP5eUTkHFUZHLa5td54e6ig892T3BlbkFJnlfaMKKd34JqGLNBhHCUBT7uKMc8EJfmcF3NIjHAEA";

const Decoder = () => {
  const [receivedMessage, setReceivedMessage] = useState(""); // Store the noisy/distorted message
  const [decodedMessage, setDecodedMessage] = useState(""); // Store the GPT response after decoding
  const [similarityScore, setSimilarityScore] = useState(""); // Store the similarity score
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const { state, setState } = useData();

  // Function to add Gaussian noise using Python API
  async function addGaussianNoise(chatMessage) {
    setIsLoading(true); // Set loading to true when starting the fetch
    try {
      const response = await fetch("https://semantic-communication.onrender.com/distort-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sentence: chatMessage, // Send the message to Python API
          snr: 30 // Optional: Send SNR value
        }),
      });

      const result = await response.json();
      const distortedMessage = result.content.split("Distorted Message: ")[1];
      setReceivedMessage(distortedMessage); // Display only the distorted message
    } catch (error) {
      console.error("Error adding Gaussian noise:", error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  }

  // Function to send the noisy/distorted message to ChatGPT for decoding
  async function processMessageToChatGPT(chatMessage) {
    setIsLoading(true); // Set loading to true when starting the fetch
    const systemMessage = {
      role: "system",
      content:
        "You are given a received message at the receiver which is affected by Gaussian noise. Now you have to decode it.",
    };

    const userMessage = {
      role: "user",
      content: `Emotion: Positive | Distorted Message: ${chatMessage}`,
    };

    const apiRequestBody = {
      model: "ft:gpt-3.5-turbo-0125:personal:text-recovery-model:AHxwcQZL",
      messages: [systemMessage, userMessage],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => data.json())
      .then((data) => {
        // Set the decoded message from GPT in state
        setDecodedMessage(data.choices[0].message.content);
      })
      .catch((error) => {
        console.error("Error decoding message:", error);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading state
      });
  }

  // Function to compute similarity score between the original and decoded message
  async function getSimilarityScore(originalMessage, decodedMessage) {
    setIsLoading(true); // Set loading to true when starting the fetch
    try {
      const response = await fetch("https://semantic-communication.onrender.com/similarity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_sentence: originalMessage,
          translated_sentence: decodedMessage
        }),
      });

      const result = await response.json();
      setState(prevState => ({
        ...prevState,
        SimilarityData: [
          ...prevState.SimilarityData,
          {
            original: originalMessage,
            decoded: decodedMessage,
            score: result.similarity_score,  
          },
        ],
      }));
      setSimilarityScore(result.similarity_score); // Set the similarity score in the state
    } catch (error) {
      console.error("Error getting similarity score:", error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  }

  // Reset receivedMessage, decodedMessage, and similarityScore if state.select is -1
  useEffect(() => {
    if (state.select === -1) {
      setReceivedMessage("");
      setDecodedMessage("");
      setSimilarityScore("");
    }
  }, [state.select]);

  const message = state.list.find((item) => item.ind === state.select);
  const userInput = state.list.find((item) => item.ind === state.select)?.input;

  return (
    <div style={{ padding: "40px", display: state.select === -1 ? "none" : "block" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Original Message Section */}
        <div style={{ flex: "1", background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
          <p>{message?.chat || "No message selected"}</p>
        </div>

        {/* Center GaussianNoise */}
        <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <GaussianNoise />
          {/* Add Noise Button */}
          <button
            className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none"
            onClick={() => addGaussianNoise(message?.chat || "No message selected")}
          >
            Add Noise
          </button>
        </div>

        {/* Received message section (distorted message or decoded message after decoding) */}
        <div style={{ flex: "1", background: "#e0f7fa", padding: "10px", borderRadius: "5px" }}>
          {isLoading ? ( // Show loading while processing
            <p>Loading...</p>
          ) : (
            <p>{decodedMessage || receivedMessage || "No received message yet"}</p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="mt-4 bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 focus:outline-none"
              onClick={() => processMessageToChatGPT(receivedMessage || "No distorted message yet")}
            >
              Decode
            </button>

            <button
              className="mt-4 bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-yellow-600 focus:outline-none"
              onClick={() => getSimilarityScore(userInput || "No message selected", decodedMessage || "No decoded message yet")}
            >
              See Similarity Score
            </button>
          </div>

          {similarityScore && (
            <p className="mt-4">Similarity Score: {similarityScore}</p>
          )}
        </div>
      </div>
      <Loading isLoading={isLoading} /> {/* Include Loading component */}
    </div>
  );
};

export default Decoder;
