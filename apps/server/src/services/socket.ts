
import { Server } from "socket.io";
import Redis from "ioredis";

const REDIS_HOST = "127.0.0.1";
const REDIS_PORT = 6379;
const SOCKET_PORT = 5000;

const pub = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
const sub = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
pub.on("error", (err) => console.error("[ioredis pub] error:", err));
sub.on("error", (err) => console.error("[ioredis sub] error:", err));

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
      try {
        this._io.listen(SOCKET_PORT);
        console.log(`Socket.io listening on port ${SOCKET_PORT}`);
      } catch (err) {
        console.error(`Failed to listen on port ${SOCKET_PORT}:`, err);
        throw err;
      }
      sub.subscribe("messages").then(() => {
        console.log("Subscribed to Redis 'messages' channel");
      }).catch((err) => {
        console.error("Redis subscribe failed:", err);
      });
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
                console.log(`Message received from client: ${data}`);
                try {
                    await pub.publish("messages", JSON.stringify({ message: data }));
                } catch (err) {
                    console.error("Failed to publish message to Redis:", err);
                }
            });
        });

        sub.on("message", (channel, message) => {
            if (channel === "messages") {
                try {
                    const parsedMessage = JSON.parse(message);
                    console.log(`Broadcasting message: ${parsedMessage.message}`);
                    io.emit("event:message", parsedMessage.message);
                } catch (err) {
                    console.warn("Invalid message payload from Redis:", message);
                }
            }
        });
    }
    get io(): Server | null {
        return this._io;
    }
}
export default SocketService;