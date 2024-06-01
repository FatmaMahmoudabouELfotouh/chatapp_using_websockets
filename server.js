const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let connectedUsers = [];

wss.on('connection', (ws) => {
    let userName = null;

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.login) {
            userName = data.userName;
            connectedUsers.push({ ws, userName });
            broadcast({ type: 'login', message: `${userName} has joined the chat`, online: getOnlineUsers() });
        } else if (data.body) {
            broadcast({ type: 'chat', message: data.body, online: getOnlineUsers() });
        }
    });

    ws.on('close', () => {
        connectedUsers = connectedUsers.filter(client => client.ws !== ws);
        if (userName) {
            broadcast({ type: 'logout', message: `${userName} has left the chat`, online: getOnlineUsers() });
        }
    });

    ws.on('error', () => {
        connectedUsers = connectedUsers.filter(client => client.ws !== ws);
    });

    const broadcast = (data) => {
        connectedUsers.forEach(client => {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify(data));
            }
        });
    };

    const getOnlineUsers = () => {
        return connectedUsers.map(client => client.userName);
    };
});

app.use(express.static(path.join(__dirname, 'static')));

server.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
