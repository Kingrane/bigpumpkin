const socket = io(); // Подключение к серверу

document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const createGameScreen = document.getElementById("create-game-screen");
    const joinGameScreen = document.getElementById("join-game-screen");
    const waitingScreen = document.getElementById("waiting-screen");
    const questionScreen = document.getElementById("question-screen");

    const createGameBtn = document.getElementById("create-game-btn");
    const joinGameBtn = document.getElementById("join-game-btn");
    const startGameBtn = document.getElementById("start-game-btn");
    const joinGameConfirmBtn = document.getElementById("join-game-confirm-btn");

    const playerNameInput = document.getElementById("player-name");
    const gameCodeSpan = document.getElementById("game-code");
    const gameCodeInput = document.getElementById("game-code-input");

    let isGameCreator = false;

    // Создание новой игры
    createGameBtn.addEventListener("click", () => {
        socket.emit('createGame');
    });

    // Присоединение к игре
    joinGameBtn.addEventListener("click", () => {
        startScreen.style.display = "none";
        joinGameScreen.style.display = "block";
    });

    // Подтверждение присоединения к игре
    joinGameConfirmBtn.addEventListener("click", () => {
        const playerName = playerNameInput.value.trim();
        const enteredCode = gameCodeInput.value.trim().toUpperCase();

        if (!playerName || !enteredCode) {
            alert("Имя и код игры должны быть заполнены.");
            return;
        }

        socket.emit('joinGame', { gameCode: enteredCode, playerName });
    });

    // Обработка успешного создания игры
    socket.on('gameCreated', (gameCode) => {
        gameCodeSpan.textContent = gameCode;
        startScreen.style.display = "none";
        createGameScreen.style.display = "block";
        isGameCreator = true;
    });

    // Обработка присоединения игрока
    socket.on('playerJoined', (players) => {
        waitingScreen.style.display = "block";
        console.log("Игроки в игре:", players);
    });

    // Начало игры после нажатия кнопки создателя
    startGameBtn.addEventListener("click", () => {
        if (!isGameCreator) return;

        const gameCode = gameCodeSpan.textContent;
        socket.emit('startGame', gameCode);
    });

    // Начало игры для всех игроков
    socket.on('gameStarted', () => {
        createGameScreen.style.display = "none";
        waitingScreen.style.display = "none";
        questionScreen.style.display = "block";
        // Здесь можно добавить логику для показа вопросов
    });
});
