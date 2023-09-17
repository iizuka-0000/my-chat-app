const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

const PORT = 5000;
let all_message = [];
let number_disconnected_clients = 0;

// 通信
io.on('connection', (socket) => {
    socket.emit('existing_message', all_message);

    socket.on('send_message', (data) => {
        io.emit('return_message', data);
        all_message.unshift(data);
    })

    socket.on('disconnect', (e) => {
        number_disconnected_clients++
        console.log('クライアントと切断  ' + number_disconnected_clients + '回目');
    });
});

server.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
})
