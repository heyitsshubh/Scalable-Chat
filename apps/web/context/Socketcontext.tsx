"use client"
import React from "react";
import { io,Socket } from "socket.io-client";

interface SocketProviderProps {
    children?:React.ReactNode;
}

interface IsocketContext{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage:(message:string)=>any;
    message:string[];
}

const SocketContext = React.createContext<IsocketContext | null>(null);


export const useSocket = () => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}

export const SocketProvider:React.FC<SocketProviderProps>=({children})=>{
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const[message,setMessage]=React.useState<string[]>([]);
    const sendMessage:IsocketContext['sendMessage']= React.useCallback((message:string)=>{
        console.log("Sending message:", message);
        if(socket){
            socket.emit("event:message", message);
        }
    },[socket]);

  const onmessageReceived = React.useCallback((raw: string) => {
        console.log("Message received from server:", raw);
        const { message: parsedMessage } = JSON.parse(raw) as { message: string };
       setMessage((prevMessages) => [...prevMessages, parsedMessage]);
    }, []);

    React.useEffect(() => {
        const socket = io("http://localhost:5000");
        socket.on("event:message", onmessageReceived);
        setSocket(socket);
        return () => {
            socket.disconnect();
            socket.off("event:message", onmessageReceived);
            setSocket(null);
        };
    }, []);
    return(
        <SocketContext.Provider value={{ sendMessage, message }}>
            {children}
        </SocketContext.Provider>
    )
}

