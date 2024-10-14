import React from "react";
import ReactMarkdown from "react-markdown";

import { useData } from "../../Context/DataProvider";
const ChatHistory = ({ chatHistory }) => {
  const {state, setState} = useData();
  const onClickHandle = (ind)=>{
    setState(prevState => ({
      ...prevState,
      select: ind
    }));
  }
  return (
    <>
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`flex items-start py-2 px-4 rounded-lg ${
            message.type === "user"
              ? "bg-gray-100 text-gray-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {message.type === "user" && (
            <span className="mr-2 font-bold text-gray-600">You:</span>
          )}
          {message.type === "bot" && (
            <span className="mr-2 font-bold text-gray-600">Gemini</span>
          )}
          <div>
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>

          {message.type === "bot" && (
  <button style={{display: state.select==-1?"Block":"None"}} className="ml-auto bg-green-500 text-white rounded-lg px-2 py-2 hover:bg-green-600 focus:outline-none" onClick={()=>{onClickHandle(message.index)}}>
    Transmit
  </button>
)}
        </div>
      ))}
    </>
  );
};

export default ChatHistory;
