// src/components/RealTimeUpdates.js
import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';

const RealTimeUpdates = () => {
  const { isConnected, sendMessage } = useWebSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user && isConnected) {
      // Authenticate the WebSocket connection
      sendMessage({
        type: 'auth',
        token: localStorage.getItem('token'),
        userId: user.id
      });
    }
  }, [user, isConnected, sendMessage]);

  return (
    <div>
      <p>WebSocket status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button 
        onClick={() => sendMessage({ type: 'ping' })}
        disabled={!isConnected}
      >
        Send Ping
      </button>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>{JSON.stringify(msg)}</p>
        ))}
      </div>
    </div>
  );
};

export default RealTimeUpdates;