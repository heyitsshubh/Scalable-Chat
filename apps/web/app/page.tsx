"use client"
import classes from "./page.module.css";
import React from "react";
import { useSocket } from "../context/Socketcontext";

export default function Home() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<string[]>([]);

  return (
    <div>
      <div>
        <input
          className={classes["chat-input"]}
          placeholder="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className={classes["chat-button"]}
          onClick={() => {
            if (message.trim()) {
              sendMessage(message);
              setMessages((prev) => [...prev, message]);
              setMessage("");
            }
          }}
        >
        Send
        </button>
        <div>
          {messages.map((e, idx) => (
            <p key={idx}>{e}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
