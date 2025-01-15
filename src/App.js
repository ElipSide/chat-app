import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ChannelList from './components/ChannelList';
import Chat from './components/Chat';
import './styles/App.css';

function App() {
  const [username, setUsername] = useState(null); // State to store the username

  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route path="/" element={<Login setUsername={setUsername} />} />
        {/* Route for the channel list page */}
        <Route path="/channels" element={<ChannelList username={username} />} />
        {/* Route for the chat page */}
        <Route path="/chat/:chatId" element={<Chat username={username} />} />
      </Routes>
    </Router>
  );
}

export default App;