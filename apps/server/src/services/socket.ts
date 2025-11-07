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

  get io() {
    return this._io;
  }
}
export default SocketService;
