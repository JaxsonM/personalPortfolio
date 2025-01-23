// import React, { useState } from 'react';
// import OpenAI from "openai";

// // Initialize the OpenAI client with the `dangerouslyAllowBrowser` option
// const openai = new OpenAI({
//   apiKey: process.env.REACT_APP_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,  // Enable for local development ONLY
// });

// const ElkChatPage: React.FC = () => {
//   const [chatLog, setChatLog] = useState<string[]>([]);
//   const [userInput, setUserInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSend = async () => {
//     if (!userInput) return;  // Ensure there is user input

//     setChatLog((prevLog) => [...prevLog, `User: ${userInput}`]); // Add user input to chat log
//     setIsLoading(true);

//     try {
//       const response = await openai.chat.completions.create({
//         model: "gpt-4o-mini",  // You can switch to GPT-4 if you have access
//         messages: [
//           { role: "system", content: "You are an expert in hunting Elk." },
//           { role: "user", content: userInput },
//         ],
//       });

//       const botReply = response.choices?.[0]?.message?.content?.trim() ?? 'No response available.';
//       setChatLog((prevLog) => [...prevLog, `Bot: ${botReply}`]);

//     } catch (error) {
//       setChatLog((prevLog) => [...prevLog, 'Bot: Error fetching response. Please try again later.']);
//       console.error('Error fetching OpenAI response:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Elk Hunting Chatbot</h1>
      
//       <div className="mt-4">
//         <div className="bg-gray-100 p-4 h-80 overflow-y-auto">
//           {chatLog.map((message, index) => (
//             <div key={index} className="mb-2">
//               {message}
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div className="mt-4 flex">
//         <input
//           type="text"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           className="border p-2 flex-grow mr-2"
//           placeholder="Ask a question about Elk hunting..."
//         />
//         <button
//           onClick={handleSend}
//           disabled={isLoading || !userInput}  // Disable if loading or no input
//           className="bg-green-500 text-white px-4 py-2 rounded"
//         >
//           {isLoading ? 'Sending...' : 'Send'}
//         </button>
//       </div>
      
//       {isLoading && <p>Loading...</p>}
//     </div>
//   );
// };

// export default ElkChatPage;
import React, { useState } from 'react';
import OpenAI from "openai";

// Initialize the OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.REACT_APP_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

const ElkChatPage: React.FC = () => {
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    // Placeholder function for sending messages
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Elk Hunting Chatbot</h1>
      
      <div className="mt-4">
        <div className="bg-gray-100 p-4 h-80 overflow-y-auto">
          {/* Placeholder for chat messages */}
        </div>
      </div>
      
      <div className="mt-4 flex">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border p-2 flex-grow mr-2"
          placeholder="Ask a question about Elk hunting..."
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !userInput}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default ElkChatPage;