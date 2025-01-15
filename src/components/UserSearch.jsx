import React, { useState } from 'react';

// Component for searching users
function UserSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm); // Trigger search with the current term
  };

  return (
    <div className="user-search">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default UserSearch;