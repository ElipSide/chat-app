
# Chat Application

This is a simple real-time chat application built with **React** for the frontend and **Express** with **WebSocket** for the backend. It allows users to create channels, join chats, and communicate in real time.

---

## Features

- **Real-time messaging**: Users can send and receive messages instantly using WebSocket.
- **Channel creation**: Users can create new chat channels.
- **User management**: Channel owners can remove users from the chat.
- **Search functionality**: Users can search for other participants in the chat.
- **Responsive design**: The application is designed to work on both desktop and mobile devices.

---

## Technologies Used

- **Frontend**:
  - React
  - React Router for navigation
  - Axios for API requests
  - CSS for styling

- **Backend**:
  - Express.js for the REST API
  - WebSocket for real-time communication
  - JSON file for data storage

---

## Installation

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/chat-app.git
   cd chat-app
   ```

2. **Install server dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   node server.js 
   ```
   This command will start both the backend server and the React frontend concurrently.

4. **Start the client**:
   ```bash
   cd src
   npm install
   ```

5. **Open the application**:
   Open your browser and go to http://localhost:3000.

6. **Enter a username to join the chat.**

---

## Project Structure

### Frontend (React)

- **`src/`**: Contains the React application code.
  - **`components/`**: React components for the application (e.g., Login, Chat, ChannelList).
  - **`hooks/`**: Custom hooks (e.g., `useWebSocket` for WebSocket communication).
  - **`styles/`**: CSS files for styling the components.
  - **`App.js`**: Main application component with routing.
  - **`index.js`**: Entry point for the React app.

### Backend (Express + WebSocket)

- **`server.js`**: The main server file that handles REST API endpoints and WebSocket connections.
- **`data.json`**: A JSON file used to store chat data (channels, messages, and users).

---

## Usage

### Login:

- Enter a username on the login page to join the chat.

### Create or Join a Channel:

- On the channels page, you can create a new channel or join an existing one.

### Chat:

- Once inside a channel, you can send and receive messages in real time.
- Channel owners can remove users from the chat.

### Search Users:

- Use the search bar to find specific users in the chat.

---

## API Endpoints

### REST API (Express)

- **`GET /api/channels`**: Get a list of all channels.
- **`POST /api/channels`**: Create a new channel.
  - **Body**: `{ name: "Channel Name", owner: "Username" }`
- **`GET /api/chat/:chatId/history`**: Get the chat history for a specific channel.

### WebSocket

- **`join`**: Join a chat channel.
- **`message`**: Send a message to the chat.
- **`leave`**: Leave a chat channel.
- **`removeUser`**: Remove a user from the chat (only for the channel owner).

---
## Contact

If you have any questions or suggestions, feel free to reach out:

- **Email**: your-email@example.com
- **GitHub**: your-github-username
