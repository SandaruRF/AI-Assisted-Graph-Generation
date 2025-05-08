import { useEffect, useState } from "react";

const socket = new WebSocket("ws://localhost:8000/ws");

const Test = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
      console.log(event.data);
      console.log(messages);
    };
  }, []);

  const sendMessage = () => {
    socket.send(input);
    setInput("");
  };
  console.log(messages);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Real-Time Chat</h2>
      <div
        style={{
          border: "1px solid black",
          padding: "1rem",
          height: "200px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Test;
