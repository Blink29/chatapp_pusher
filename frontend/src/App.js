import "./App.css";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get("/messages/sync");
      setMessages(res.data);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const pusher = new Pusher("a57a1e023d0a2976ddb6", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("message");
    channel.bind("inserted", (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  const sendMsg = async (e) => {
    e.preventDefault();
    await axios.post("/messages/new", {
      name: "react",
      message: input,
      recieved: false
    });
    setInput(''); 
    await console.log(messages);
  };

  return (
    <div className="App">
      <h1>BASIC WHATSAPP BACKEND</h1>
      <form onSubmit={sendMsg}>
        <input
          type="text"
          placeholder="enter a msg"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </form>
      {messages.map((message) => (
        <>
          <p>{message.name}</p>
          <p>{message.message}</p>
          <h6>{message.recieved}</h6>
        </>
      ))}
    </div>
  );
}

export default App;
