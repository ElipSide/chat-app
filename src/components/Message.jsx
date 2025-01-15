import React from 'react';

// Component to display a single message
function Message({ username, text }) {
  return (
    <div className="message">
      <strong>{username}:</strong> {text}
    </div>
  );
}

export default Message;