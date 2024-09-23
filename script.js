const socket = io(); // Подключение к серверу

document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const createGameScreen = document.getElementById("create-game-screen");
    const joinGameScreen = document.getElementById("join-game-screen");
    const waitingScreen = document.getElementById("waiting-screen");
    const questionScreen = document.getElementById("question-screen");
    const resultsScreen = document.getElementById("results-screen");

    const createGameBtn = document.getElementById("create-game-btn");
    const joinGameBtn = document.getElementById("join-game-btn");
    const startGameBtn = document.getElementById("start-game-btn");
    const joinGameConfirmBtn = document.getElementById("join-game-confirm-btn");
    const addQuestionBtn = document.getElementById("add-question-btn");
    const submitAnswerBtn = document.getElementById("submit-answer");
    const nextRoundBtn = document.getElementById("next-round-btn");

    const playerNameInput = document.getElementById("player-name");
    const gameCodeSpan = document.getElementById("game-code");
    const gameCodeInput = document.getElementById("game-code-input");
    const questionInput = document.getElementById("question-input");
    const currentQuestion = document.getElementById("current-question");
    const playerAnswer = document.getElementById("player-answer");
    const answersList = document.getElementById("answers-list");
    const resultAnswers = document.getElementById("result-answers");

    let gameCode = "";
    let players = [];
    let questions = [];
    let roundAnswers = {};

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

    // Добавление вопроса
    addQuestionBtn.addEventListener("click", () => {
        const question = questionInput.value.trim();
        if (question) {
            questions.push(question);
            questionInput.value = "";
            updateQuestionsList();
        }
    });

    function updateQuestionsList() {
        const questionsList = document.getElementById("questions-list");
        questionsList.innerHTML = "";
        questions.forEach((q, index) => {
            questionsList.innerHTML += `<p>${index + 1}. ${q}</p>`;
        });
    }

    // Обработка успешного создания игры
    socket.on('gameCreated', (code) => {
        gameCode = code;
        gameCodeSpan.textContent = gameCode;
        startScreen.style.display = "none";
        createGameScreen.style.display = "block";
    });

    // Обработка присоединения игрока
    socket.on('playerJoined', (playersList) => {
        players = playersList;
        waitingScreen.style.display = "block";
    });

    // Начало игры
    startGameBtn.addEventListener("click", () => {
        if (questions.length === 0) {
            alert("Добавьте хотя бы один вопрос!");
            return;
        }
        socket.emit('startGame', { gameCode, questions });
    });

    // Начало вопроса для всех игроков
    socket.on('gameStarted', () => {
        createGameScreen.style.display = "none";
        waitingScreen.style.display = "none";
        questionScreen.style.display = "block";
        showQuestion();
    });

    // Показать вопрос
    function showQuestion() {
        const questionIndex = Math.floor(Math.random() * questions.length);
        currentQuestion.textContent = questions[questionIndex];
        roundAnswers = {}; // Сброс ответов для нового вопроса
    }

    // Отправка ответа
    submitAnswerBtn.addEventListener("click", () => {
        const answer = playerAnswer.value.trim();
        if (answer) {
            const question = currentQuestion.textContent;
            socket.emit('submitAnswer', { question, answer });
            playerAnswer.value = "";
        }
    });

    // Обработка получения ответов
    socket.on('receiveAnswers', (answers) => {
        answersList.style.display = "block";
        answersList.innerHTML = "";
        answers.forEach(a => {
            answersList.innerHTML += `<p>${a}</p>`;
        });
        // Позволить голосовать
        displayVoteOptions(
