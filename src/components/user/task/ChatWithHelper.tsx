import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000');

interface Message {
  sender: string;
  text: string;
}

interface ChatProps {
  userId: string;
  helperId: string;
  helperName: string;
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ userId, helperId,helperName, onClose }) => {
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const startChat = async () => {
    if (!userId || !helperId) return;

    setChatStarted(true);
    try {
      const res = await axios.get(`http://localhost:4000/messages/${userId}/${helperId}`);
      setMessages(res.data.map((m: any) => ({ sender: m.senderId, text: m.content })));
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    if (!chatStarted) return;

    socket.emit('start-chat', userId, helperId);

    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [chatStarted, userId, helperId]);

  useEffect(() => {
    startChat();
  }, [userId, helperId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      sender: userId,
      receiver: helperId,
      text: newMessage,
    };

    socket.emit('send-message', messageData);

    axios.post("http://localhost:4000/messages", {
      senderId: userId,
      receiverId: helperId,
      content: newMessage,
    });
    setMessages(prev => [...prev, { sender: userId, text: newMessage }]);
    setNewMessage('');
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 flex flex-col">
      <div className="bg-violet-700 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">{ helperName}</h2>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Chat history */}
      <div className="p-4 flex-grow overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-2 text-sm ${msg.sender === userId ? 'text-right' : 'text-left'}`}>
              <span className="font-medium">{msg.sender === userId ? 'You' : msg.sender}</span>: {msg.text}
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input section */}
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-grow border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        <button
          onClick={handleSendMessage}
          className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
