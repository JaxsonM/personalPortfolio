import React, { useState } from "react";

const HelloPage: React.FC = () => {
  const [message, setMessage] = useState("");

  const fetchHello = async () => {
    try {
      const response = await fetch(
        "https://c3kdftan1m.execute-api.us-east-1.amazonaws.com/dev/hello"
      );
  
      console.log("📦 Raw response object:", response);
  
      const text = await response.text(); // Get the raw response first
      console.log("📄 Raw text:", text);
  
      const data = JSON.parse(text);
      console.log("✅ Parsed JSON:", data);
  
      setMessage(data.message); // Expecting '👋 Hello from Lambda!'
    } catch (err) {
      console.error("❌ Error calling API:", err);
      setMessage("Error calling API.");
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lambda Hello World</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={fetchHello}
      >
        Call API
      </button>
      

      <div className="mt-6 text-lg">
        <strong>Message from API:</strong>
        <p className="text-blue-600 mt-2">{message || "No message yet."}</p>
      </div>
      {/* <button onClick={() => setMessage("Hello World!")}>Set Test Message</button> */}

    </div>
  );
};

export default HelloPage;
