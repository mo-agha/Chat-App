import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import addMessage from "./redux/actions";
import "./index.css";

const socket = io("http://localhost:5000");

const ChatApp = () => {
  const messages = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on("message", (newMessage) => {
      dispatch(addMessage(newMessage));
    });

    return () => {
      socket.off('message');
    }
    
  }, [dispatch]);

  const sendMessage = () => {
    if (messageInput.trim() !== "" && username.trim() !== "") {
      const newMessage = {
        username,
        message: messageInput.trim(),
      };

      socket.emit("message", newMessage);
      dispatch(addMessage(newMessage));
      setMessageInput("");
    }
  };

  return (
    <div id="root">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.username}:</strong> {message.message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        />
        <input
          type="text"
          placeholder="Type your message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
