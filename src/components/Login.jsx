import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

// Login component
function Login({ setUsername }) {
    const [inputUsername, setInputUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUsername.trim()) {
        setUsername(inputUsername); // Save the username
        navigate('/channels'); // Navigate to the channels page
    } else {
        setError('Please enter a username'); // Show error if username is empty
    }
    };

    return (
        <div className="login-container">
      <h1>Введите ваш никнейм</h1>
      <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Ваш никнейм"
            required
            />
            <button type="submit">Продолжить</button>
        </form>
        {error && <p className="error">{error}</p>}
        </div>
    );
    }

export default Login;