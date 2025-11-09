import { Server } from "socket.io";
import Redis from "ioredis";

const pub= new Redis({
    host: "127.0.0.1",
  port: 6379

});
const sub= new Redis({
   host: "127.0.0.1",
  port: 6379
});

class SocketService {
    private _io: Server | null = null;
    constructor() {
      console.log("SocketService initialized");
      this._io = new Server({
        cors: {
        allowedHeaders: ["*"],
          origin: "*",
        },
      });
         sub.subscribe("messages");
    }

    public initlisteners() {
        console.log("Initializing socket listeners");
        const io = this.io;
        if (!io) {
            console.error("Socket.io server is not initialized");
            return;
        }
        io.on("connection", (socket) => {
            console.log(`New client connected: ${socket.id}`);
            socket.on("event:message", async (data) => {
                console.log(`Message received: ${data}`);
               await pub.publish("messages", JSON.stringify({ message: data }));

            });
        });

        sub.on("message", (channel, message) => {
            if (channel === "messages") {
                const parsedMessage = JSON.parse(message);
                console.log(`Broadcasting message: ${parsedMessage.message}`);
                io.emit("event:message", parsedMessage.message);
            }
        });
    }

        

    get io(): Server | null {
        return this._io;
    }
}
export default SocketService;
