



import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface ChatProps {
  helperId: string;
  taskId: string;
  onClose: () => void;
}

const ChatWithHelper: React.FC<ChatProps> = ({ helperId, taskId, onClose }) => {
    console.log('ChatWithHelper rendered', { helperId, taskId });
  
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useSelector((state: RootState) => state.auth);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simulate fetching messages for the demo
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // This would be replaced with an actual API call in production
        // Example: const response = await fetch(`/api/chats/${taskId}`);
        
        // Simulated response data
        const demoMessages: Message[] = [
          {
            id: '1',
            senderId: user?.id || '',
            receiverId: helperId,
            content: 'Hi there! I was wondering if you have any questions about the task?',
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            read: true
          },
          {
            id: '2',
            senderId: helperId,
            receiverId: user?.id || '',
            content: 'Hello! Yes, I wanted to confirm the tools I need to bring. Should I bring my own equipment?',
            timestamp: new Date(Date.now() - 82800000), // 23 hours ago
            read: true
          },
          {
            id: '3',
            senderId: user?.id || '',
            receiverId: helperId,
            content: 'I have basic tools, but if you have specialized equipment for the job, that would be great!',
            timestamp: new Date(Date.now() - 79200000), // 22 hours ago
            read: true
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setMessages(demoMessages);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [helperId, taskId, user]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `temp-${Date.now()}`, // Would be replaced by server-generated ID
      senderId: user?.id || '',
      receiverId: helperId,
      content: newMessage,
      timestamp: new Date(),
      read: false
    };
    
    // Optimistically add message to UI
    setMessages(prevMessages => [...prevMessages, newMsg]);
    setNewMessage('');
    
    try {
      // This would be replaced with an actual API call in production
      // Example: await fetch('/api/messages', { method: 'POST', body: JSON.stringify(newMsg) });
      
      // Simulate successful message sending
      console.log('Message sent:', newMsg);
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Could add error handling UI here
    }
  };
  
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach(message => {
    const dateKey = message.timestamp.toDateString();
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-3/4 flex flex-col overflow-hidden">
        {/* Chat header */}
        <div className="bg-violet-700 text-white px-6 py-4 flex justify-between items-center shadow">
          <div className="flex items-center">
            <div className="bg-violet-100 text-violet-800 w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium mr-3">
              {helperId.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold">Helper {helperId.substring(0, 8)}...</h3>
              <p className="text-xs text-violet-200">Task ID: {taskId.substring(0, 8)}...</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-violet-100 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Chat messages */}
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <>
              {Object.keys(groupedMessages).map(dateKey => (
                <div key={dateKey} className="mb-4">
                  <div className="flex justify-center mb-4">
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {formatMessageDate(new Date(dateKey))}
                    </span>
                  </div>
                  {groupedMessages[dateKey].map(message => (
                    <div 
                      key={message.id}
                      className={`flex mb-4 ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                          message.senderId === user?.id 
                            ? 'bg-violet-700 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div 
                          className={`text-xs mt-1 ${
                            message.senderId === user?.id ? 'text-violet-200' : 'text-gray-500'
                          } flex items-center justify-end`}
                        >
                          {formatMessageTime(message.timestamp)}
                          {message.senderId === user?.id && (
                            <span className="ml-1">
                              {message.read ? (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {/* Message input */}
        <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center">
            <button 
              type="button"
              className="text-gray-500 hover:text-violet-700 mr-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:border-transparent"
              placeholder="Type your message..."
            />
            <button 
              type="submit"
              className="bg-violet-700 hover:bg-violet-800 text-white rounded-full p-2 ml-2"
              disabled={!newMessage.trim()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWithHelper;