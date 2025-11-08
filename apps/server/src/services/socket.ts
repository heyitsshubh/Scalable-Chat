import { Server } from "socket.io";

class SocketService {
    private _io: Server | null = null;
    constructor() {
      console.log("SocketService initialized");
      this._io = new Server({
        cors: {
          origin: "*",
        },
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
            socket.on("event:message", (data) => {
                console.log(`Message received: ${data}`);
            });
        });
    }

    get io(): Server | null {
        return this._io;
    }
}
export default SocketService;
