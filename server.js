const express = require('express');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const port = 5000;

// Path to the JSON file for storing data
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware for JSON and CORS
app.use(express.json());
app.use(require('cors')());

// Load data from the JSON file
function loadData() {
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return { channels: [], chats: {} }; // Initialize data if the file doesn't exist
}

// Save data to the JSON file
function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Initialize data
let data = loadData();
const chats = data.chats || {}; // Initialize chats if data.chats is missing

// Start the HTTP server
const server = app.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

// API to get the list of channels
app.get('/api/channels', (req, res) => {
  res.json(data.channels || []); // Return an empty array if data.channels is missing
});

// API to create a new channel
app.post('/api/channels', (req, res) => {
  const { name, owner } = req.body;
  if (!name || !owner) {
    return res.status(400).json({ error: 'Channel name and owner are required' });
  }

  const newChannel = {
    id: Date.now().toString(),
    name,
    owner,
  };

  data.channels.push(newChannel);
  chats[newChannel.id] = { users: {}, messages: [], owner }; // Create a new chat
  saveData(data); // Save the data

  res.status(201).json(newChannel);
});

// API to get chat history
app.get('/api/chat/:chatId/history', (req, res) => {
  const { chatId } = req.params;
  if (chats[chatId]) {
    res.json({ messages: chats[chatId].messages });
  } else {
    res.status(404).json({ error: 'Chat not found' });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message from client:', data);

      if (!data.type) {
        console.error('Received message without type:', data);
        return;
      }

      switch (data.type) {
        case 'join':
          handleJoin(data, ws);
          break;
        case 'message':
          handleMessage(data);
          break;
        case 'leave':
          handleLeave(data);
          break;
        case 'removeUser':
          handleRemoveUser(data);
          break;
        default:
          console.error('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('User disconnected');
    // Remove the user from all chats on disconnect
    if (chats) {
      Object.keys(chats).forEach((chatId) => {
        if (chats[chatId].users[ws.username]) {
          delete chats[chatId].users[ws.username];
          broadcastChatData(chatId);
        }
      });
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Function to handle user joining a chat
function handleJoin(data, ws) {
  const { chatId, username } = data;
  if (!chatId || !username) {
    console.error('Invalid join data:', data);
    return;
  }

  if (!chats[chatId]) {
    chats[chatId] = { users: {}, messages: [], owner: username };
  }
  const chat = chats[chatId];

  // Check if the username is already taken
  if (chat.users[username]) {
    ws.send(JSON.stringify({ type: 'error', message: 'Username is already taken' }));
    return;
  }

  chat.users[username] = username; // Save the user
  ws.username = username; // Store the username in the WebSocket
  broadcastChatData(chatId);
}

// Function to handle chat messages
function handleMessage(data) {
  const { chatId, username, message: text } = data;
  if (!chatId || !username || !text) {
    console.error('Invalid message data:', data);
    return;
  }

  if (!chats[chatId]) {
    console.error(`Chat with ID ${chatId} not found`);
    return;
  }

  const chat = chats[chatId];
  chat.messages.push({ username, text }); // Add the message to the chat
  saveData(data); // Save the data
  broadcastChatData(chatId); // Broadcast the updated chat data
}

// Function to handle user leaving a chat
function handleLeave(data) {
  const { chatId, username } = data;
  if (!chatId || !username) {
    console.error('Invalid leave data:', data);
    return;
  }

  if (chats[chatId]) {
    delete chats[chatId].users[username]; // Remove the user
    broadcastChatData(chatId);
  }
}

// Function to handle user removal by the owner
function handleRemoveUser(data) {
  const { chatId, targetUsername, username } = data;
  if (!chatId || !targetUsername || !username) {
    console.error('Invalid remove user data:', data);
    return;
  }

  if (chats[chatId]) {
    const chat = chats[chatId];
    if (chat.owner === username) {
      delete chat.users[targetUsername]; // Remove the user
      saveData(data); // Save the data
      broadcastChatData(chatId); // Broadcast the updated chat data
    } else {
      console.error('Only the owner can remove users');
    }
  }
}

// Function to broadcast chat data to all clients
function broadcastChatData(chatId) {
  if (chats[chatId]) {
    const chat = chats[chatId];
    const data = {
      type: 'chatData',
      chatId,
      users: Object.values(chat.users),
      messages: chat.messages,
      owner: chat.owner,
    };

    console.log(`Broadcasting chat data for ${chatId}:`, data);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } else {
    console.error(`Chat with ID ${chatId} not found for broadcasting`);
  }
}