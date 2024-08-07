import { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    setWs(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'messages') {
        setMessages(data.data);
      }
    };

    ws.onopen = () => {
      console.log('Conectado al servidor');
    };

    ws.onclose = () => {
      console.log('Desconectado del servidor');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'new-message', data: newMessage }));
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Mensajes</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
}

export default App;