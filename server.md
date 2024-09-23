const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let gameRooms = {};

app.use(express.static('public')); // для размещения клиентских файлов (HTML, CSS, JS)

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Создание новой игры
    socket.on('createGame', () => {
        const gameCode = generateGameCode();
        gameRooms[gameCode] = { players: [] };
        socket.join(gameCode);
        socket.emit('gameCreated', gameCode);
    });

    // Присоединение к существующей игре
    socket.on('joinGame', ({ gameCode, playerName }) => {
        if (gameRooms[gameCode]) {
            gameRooms[gameCode].players.push(playerName);
            socket.join(gameCode);
            io.to(gameCode).emit('playerJoined', gameRooms[gameCode].players);
        } else {
            socket.emit('error', 'Неверный код игры');
        }
    });

    // Запуск игры
    socket.on('startGame', (gameCode) => {
        io.to(gameCode).emit('gameStarted');
    });
});

function generateGameCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        code += letters[randomIndex];
    }
    return code;
}

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
