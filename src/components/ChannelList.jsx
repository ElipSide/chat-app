import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ChannelList.css';

// Component to display and manage the list of channels
function ChannelList({ username }) {
  const [channels, setChannels] = useState([]);
  const [newChannelName, setNewChannelName] = useState('');
  const navigate = useNavigate();

  // Load channels from the server
  useEffect(() => {
    axios.get('http://localhost:5000/api/channels')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setChannels(response.data);
        } else {
          console.error('Expected an array of channels, but got:', response.data);
          setChannels([]); // Set an empty array to avoid errors
        }
      })
      .catch((error) => {
        console.error('Error loading channels:', error);
        setChannels([]); // Set an empty array in case of error
      });
  }, []);

  // Function to create a new channel
  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      axios.post('http://localhost:5000/api/channels', { name: newChannelName, owner: username })
        .then((response) => {
          if (response.data && response.data.id) {
            setChannels((prevChannels) => [...prevChannels, response.data]);
            setNewChannelName('');
          } else {
            console.error('Expected a channel object, but got:', response.data);
          }
        })
        .catch((error) => {
          console.error('Error creating channel:', error);
        });
    }
  };

  return (
    <div className="channel-list">
      <h1>Каналы</h1>
      <div className="create-channel">
        <input
          type="text"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          placeholder="Имя канала"
        />
        <button onClick={handleCreateChannel}>Создать канал</button>
      </div>
      <ul>
        {Array.isArray(channels) && channels.map((channel) => (
          <li key={channel.id} onClick={() => navigate(`/chat/${channel.id}`)}>
            {channel.name} (Владелец: {channel.owner})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelList;