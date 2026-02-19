import React, { useEffect, useRef, useState } from 'react'

function Chat({socketRef, roomId}) {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if(!socketRef.current) return;

        const handleMessage = (data) =>{
            console.log("MESSAGE RECEIVED:", data); // DEBUG

            setMessages((prev) => [...prev, data]);
        };

        socketRef.current.on("receive-message", handleMessage);

        return () => {
            socketRef.current.off("receive-message", handleMessage);
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if(!input.trim()) return;

        socketRef.current.emit("send-message", {
            roomId,
            message: input,
        });

        setInput("");
    }

  return (
    <div className='chat-panel'>
        <div className='chat-messages'>
            {messages.map((msg, i) => (
                <div key={i} className='chat-message'>
                    <strong>{msg.username}</strong>: {msg.message}
                    <small> ({msg.time})</small>
                </div>
            ))}
        </div>   

        <div className='chat-input'>
            <input value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Type message...'
            />
            <button onClick={sendMessage}>Send</button>
        </div>     
    </div>
  )
}

export default Chat;