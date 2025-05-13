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

const Chat: React.FC<ChatProps> = ({ userId, helperId, helperName, onClose }) => {
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      setIsTyping(false);
    });

    socket.on('typing', () => {
      setIsTyping(true);
    });

    socket.on('stop-typing', () => {
      setIsTyping(false);
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('stop-typing');
    };
  }, [chatStarted, userId, helperId]);

  useEffect(() => {
    startChat();
    if (inputRef.current) {
      inputRef.current.focus();
    }
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

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col rounded-l-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-semibold">
            {helperName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{helperName}</h2>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <span className="text-xs text-green-100">Online</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Chat history */}
      <div className="p-4 flex-grow overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="font-medium">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md py-2 px-4 rounded-2xl ${
                    msg.sender === userId 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 shadow-md rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === userId ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {formatTime()}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md py-3 px-4 rounded-2xl rounded-tl-none max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Input section */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-1">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-grow bg-transparent py-2 px-1 focus:outline-none text-gray-700"
          />
          <button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ''}
            className={`p-2 rounded-full ${
              newMessage.trim() === '' 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-white bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;