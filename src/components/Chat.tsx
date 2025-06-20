// import React, { useEffect, useState } from "react";
// import socket from "../config/socket";
// import axios from "axios";

// type Message = {
//   sender: string;
//   text: string;
// };

// const Chat: React.FC = () => {
//   const [userId, setUserId] = useState("");
//   const [neighborId, setNeighborId] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [chatStarted, setChatStarted] = useState(false);

//   useEffect(() => {
//     if (!chatStarted) return;

//     socket.emit("start-chat", userId, neighborId);

//     socket.on("message", (message: Message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     // Cleanup
//     return () => {
//       socket.off("message");
//     };
//   }, [chatStarted, userId, neighborId]);

//   const startChat = async () => {
//     if (!userId || !neighborId) return;

//     setChatStarted(true);

//     // Load existing chat history
//     try {
//       const res = await axios.get(`http://localhost:4000/messages/${userId}/${neighborId}`);
//       setMessages(res.data.map((m: any) => ({ sender: m.senderId, text: m.content })));
//     } catch (err) {
//       console.error("Error fetching messages:", err);
//     }
//   };

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     socket.emit("send-message", userId, neighborId, newMessage);

//     axios.post("http://localhost:4000/messages", {
//       senderId: userId,
//       receiverId: neighborId,
//       content: newMessage,
//     });

//     setMessages((prev) => [...prev, { sender: userId, text: newMessage }]);
//     setNewMessage("");
//   };

//   return (
//     <div>
//       {!chatStarted ? (
//         <div>
//           <input
//             value={userId}
//             onChange={(e) => setUserId(e.target.value)}
//             placeholder="Enter your User ID"
//           />
//           <input
//             value={neighborId}
//             onChange={(e) => setNeighborId(e.target.value)}
//             placeholder="Enter Neighbor User ID"
//           />
//           <button onClick={startChat}>Start Chat</button>
//         </div>
//       ) : (
//         <>
//           <h2>Chat with {neighborId}</h2>
//           <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc" }}>
//             {messages.map((msg, i) => (
//               <div key={i} style={{ textAlign: msg.sender === userId ? "right" : "left" }}>
//                 <strong>{msg.sender}:</strong> {msg.text}
//               </div>
//             ))}
//           </div>
//           <input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message"
//           />
//           <button onClick={sendMessage}>Send</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Chat;
 