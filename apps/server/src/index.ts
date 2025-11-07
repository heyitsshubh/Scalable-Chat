import http from 'http';
import SocketService from './services/socket';

async function startServer() {
    const socketService = new SocketService();
    const io = socketService.io;
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!\n');
    });
    io?.attach(server);
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
    );
    
}

startServer();