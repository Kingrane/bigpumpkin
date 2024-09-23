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

    let gameCode = "";
    let players = [];
    let isGameCreator = false;

    // Генерация кода игры из 4 заглавных букв
    function generateGameCode() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let code = "";
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            code += letters[randomIndex];
        }
        return code;
    }

    // Показать экран создания игры
    createGameBtn.addEventListener("click", () => {
        gameCode = generateGameCode();
        gameCodeSpan.textContent = gameCode;
        startScreen.style.display = "none";
        createGameScreen.style.display = "block";
        isGameCreator = true;
    });

    // Присоединение к игре по коду
    joinGameBtn.addEventListener("click", () => {
        startScreen.style.display = "none";
        joinGameScreen.style.display = "block";
    });

    // Подтверждение присоединения к игре
    joinGameConfirmBtn.addEventListener("click", () => {
        const playerName = playerNameInput.value.trim();
        const enteredCode = gameCodeInput.value.trim().toUpperCase();

        if (!playerName || enteredCode !== gameCode) {
            alert("Неверный код или имя не введено. Попробуйте снова.");
            return;
        }

        players.push(playerName);
        joinGameScreen.style.display = "none";
        waitingScreen.style.display = "block";
    });

    // Начало игры после того, как создатель нажмет кнопку
    startGameBtn.addEventListener("click", () => {
        if (players.length === 0) {
            alert("Необходимо, чтобы хотя бы один игрок присоединился!");
            return;
        }

        createGameScreen.style.display = "none";
        questionScreen.style.display = "block";

        // Здесь можно начать игру: например, отправить первый вопрос и включить логику ответов
        startGame();
    });

    // Запуск игрового процесса (примерно, можно добавить любые правила игры)
    function startGame() {
        console.log("Игра началась с игроками:", players);
        // Здесь мы можем добавить логику для показа вопросов, ответов, голосования и т.д.
    }
});
