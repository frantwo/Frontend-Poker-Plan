import { useState, useEffect } from 'react';

function App(): JSX.Element {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsInstance = new WebSocket('ws://localhost:3000');
    setWs(wsInstance);

    wsInstance.onmessage = (event: MessageEvent) => {
      let message: string;
      message = event.data;
      const data = JSON.parse(message);

      if (data.type === 'messages') {
        setMessages(data.data);
      }
    };

    wsInstance.onopen = () => {
      console.log('Conectado al servidor');
    };

    wsInstance.onclose = () => {
      console.log('Desconectado del servidor');
    };

    return () => {
      wsInstance.close();
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
        onChange={(e) => setNewMessage((e.target as HTMLInputElement).value)}
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
}

export default App;