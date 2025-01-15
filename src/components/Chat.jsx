import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useWebSocket from '../hooks/useWebSocket';
import Message from './Message';
import '../styles/Chat.css';

// Chat component
function Chat({ username }) {
  const { chatId } = useParams(); // Extract chatId from URL
  const { messages, users, owner, sendMessage, sendRemoveUser } = useWebSocket(chatId, username);
  const navigate = useNavigate();

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [showRemovedModal, setShowRemovedModal] = useState(false); // State for modal
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Flag for data loading

  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll to new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle user removal
  useEffect(() => {
    if (isDataLoaded && !users.includes(username)) {
      setShowRemovedModal(true); // Show modal if user is not in the list
    }
  }, [users, username, isDataLoaded]);

  // Set isDataLoaded to true when users data is loaded
  useEffect(() => {
    if (users.length > 0) {
      setIsDataLoaded(true);
    }
  }, [users]);

  // Function to send a message
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage); // Send the message
      setInputMessage(''); // Clear the input field
    }
  };

  // Function to remove a user
  const handleRemoveUser = (userToRemove) => {
    if (window.confirm(`Are you sure you want to remove ${userToRemove}?`)) {
      sendRemoveUser(userToRemove); // Send remove user request
    }
  };

  // Function to confirm removal and navigate
  const handleConfirmRemoval = () => {
    setShowRemovedModal(false); // Hide the modal
    navigate('/channels'); // Navigate to the channels page
  };

  return (
    <div className="chat-container">
      {/* Chat main section */}
      <div className="chat-main">
        <h2>Чат: {chatId}</h2>
        <div className="messages">
          {messages.map((msg, index) => (
            <Message key={index} username={msg.username} text={msg.text} />
          ))}
          <div ref={messagesEndRef} /> {/* Ref for auto-scrolling */}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Введите сообщение"
          />
          <button onClick={handleSendMessage}>Отправить</button>
        </div>
      </div>

      {/* User list section */}
      <div className="user-list-container">
        <h3>Участники:</h3>
        {/* Search input for users */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск участников"
          className="search-input"
        />
        <ul>
          {filteredUsers.map((user, index) => (
            <li key={index}>
              {user}
              {owner === username && user !== username && (
                <button onClick={() => handleRemoveUser(user)}>Удалить</button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for removal notification */}
      {showRemovedModal && (
        <div className="modal-overlay">
          <div className="modal">
          <h3>Вас удалили из чата</h3>
          <p>Вы больше не являетесь участником этого чата.</p>
            <button onClick={handleConfirmRemoval}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;