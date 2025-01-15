import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';

// Custom hook for WebSocket communication
export default function useWebSocket(chatId, username) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); // Ensure users is an array
  const [owner, setOwner] = useState(null);
  const [socket, setSocket] = useState(null);

  // Use useRef to store clientId (may be needed in the future)
  const clientIdRef = useRef(null);

  // Function to send a message
  const sendMessage = useCallback(
    (message) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'message',
            chatId,
            username,
            message,
          })
        );
      } else {
        console.error('WebSocket is not ready to send a message');
      }
    },
    [socket, chatId, username]
  );

  // Function to remove a user
  const sendRemoveUser = useCallback(
    (targetUsername) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'removeUser',
            chatId,
            targetUsername,
            username,
          })
        );
      } else {
        console.error('WebSocket is not ready to send a message');
      }
    },
    [socket, chatId, username]
  );

  // Effect to handle WebSocket connection
  useEffect(() => {
    if (!chatId) {
      console.error('chatId is not defined');
      return;
    }

    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      console.log('WebSocket connected');

      // Request chat history
      axios.get(`http://localhost:5000/api/chat/${chatId}/history`)
        .then((response) => {
          setMessages(response.data.messages || []);
        })
        .catch((error) => {
          console.error('Error loading chat history:', error);
        });

      // Send a 'join' message to connect to the chat
      ws.send(
        JSON.stringify({
          type: 'join',
          chatId,
          username,
        })
      );

      // Store clientId (may be needed in the future)
      clientIdRef.current = Date.now().toString();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'error') {
        console.error('Error from server:', data.message);
        return;
      }
      if (data.type === 'chatData' && data.chatId === chatId) {
        setMessages(data.messages);
        setUsers(Object.values(data.users)); // Convert object to array
        setOwner(data.owner);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'leave',
            chatId,
            username,
          })
        );
        ws.close();
      }
    };
  }, [chatId, username]);

  return { messages, users, owner, sendMessage, sendRemoveUser };
}