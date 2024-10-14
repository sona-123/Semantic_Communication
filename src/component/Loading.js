// Loading.js
import React from "react";

const Loading = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  );
};

export default Loading;
