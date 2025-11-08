"use client"
import React from "react";

interface SocketProviderProps {
    children?:React.ReactNode;
}

interface IsocketContext{
    sendMessage:(message:string)=>any;
}

const SocketContext = React.createContext<IsocketContext['sendMessage'] | null>(null);

export const SocketProvider:React.FC<SocketProviderProps>=({children})=>{

    const sendMessage:IsocketContext['sendMessage']= React.useCallback((message:string)=>{
        console.log("Sending message:", message);
    },[]);
    return(
        <SocketContext.Provider value={sendMessage}>
            {children}
        </SocketContext.Provider>
    )
}

