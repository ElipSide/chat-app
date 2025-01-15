import React from 'react';

// Component for channel settings
function ChannelSettings({ channelId, user, sendRemoveUser }) {
  const handleRemoveUser = (targetUsername) => {
    if (window.confirm(`Are you sure you want to remove ${targetUsername}?`)) {
      sendRemoveUser(targetUsername);
    }
  };

  return (
    <div className="channel-settings">
      <h3>Channel Management</h3>
      <button onClick={() => handleRemoveUser(user)}>Remove User</button>
    </div>
  );
}

export default ChannelSettings;