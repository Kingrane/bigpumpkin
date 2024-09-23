const questions = [
    "Ваш самый смешной анекдот?",
    "Какое самое странное имя вы когда-либо слышали?",
    "Если бы вы были животным, то каким?",
    "Какой самый нелепый поступок вы совершали?",
    "Что вы бы сделали, если бы выиграли миллион?"
];

let currentQuestionIndex = 0;
let currentPlayerIndex = 0;
let players = [];
let gameCode = "";

// Элементы DOM
const currentQuestion = document.getElementById("current-question");
const playerAnswer = document.getElementById("player-answer");
const submitAnswerBtn = document.getElementById("submit-answer");
const nextQuestionBtn = document.getElementById("next-question-btn");
const createGameBtn = document.getElementById("create-game");
const joinGameBtn = document.getElementById("join-game");
const gameCodeDisplay = document.getElementById("game-code");
const joinCodeInput = document.getElementById("join-code");
const playerNameInput = document.getElementById("player-name");
const waitingScreen = document.getElementById("waiting-screen");
const startGameBtn = document.getElementById("start-game");
const votingScreen = document.getElementById("voting-screen");
const votingList = document.getElementById("voting-list");
const submitVoteBtn = document.getElementById("submit-vote");

// Генерация кода игры
function generateGameCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        code += letters[randomIndex];
    }
    return code;
}

// Создание игры
createGameBtn.addEventListener("click", () => {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert("Пожалуйста, введите ваше имя.");
        return;
    }

    gameCode = generateGameCode();
    players = [{ name: playerName, answers: [] }]; // добавление создателя
    gameCodeDisplay.textContent = `Код игры: ${gameCode}`;
    gameCodeDisplay.style.display = "block";
    waitingScreen.style.display = "block";
    startGameBtn.style.display = "block"; // показать кнопку "Начать игру"
});

// Присоединение к игре
joinGameBtn.addEventListener("click", () => {
    const enteredCode = joinCodeInput.value.trim();
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert("Пожалуйста, введите ваше имя.");
        return;
    }
    if (enteredCode === gameCode) {
        players.push({ name: playerName, answers: [] }); // добавление игрока
        waitingScreen.style.display = "block";
        startGameBtn.style.display = "block"; // показать кнопку "Начать игру"
    } else {
        alert("Неверный код игры!");
    }
});

// Начать игру
startGameBtn.addEventListener("click", () => {
    currentPlayerIndex = 0; // сброс индекса игрока
    waitingScreen.style.display = "none"; // скрыть экран ожидания
    showQuestion();
});

// Показать вопрос
function showQuestion() {
    if (currentPlayerIndex < players.length) {
        const player = players[currentPlayerIndex];
        currentQuestion.textContent = questions[currentPlayerIndex % questions.length]; // назначение вопроса
        document.getElementById("question-screen").style.display = "block";
    } else {
        startVoting();
    }
}

// Обработка ответа игрока
submitAnswerBtn.addEventListener("click", () => {
    const answer = playerAnswer.value.trim();
    if (answer) {
        players[currentPlayerIndex].answers.push(answer); // сохранить ответ текущего игрока
        playerAnswer.value = "";
        currentPlayerIndex++;
        if (currentPlayerIndex < players.length) {
            showQuestion();
        } else {
            endQuestionRound();
        }
    }
});

// Завершение раунда вопросов
function endQuestionRound() {
    document.getElementById("question-screen").style.display = "none";
    startVoting();
}

// Начать голосование
function startVoting() {
    votingList.innerHTML = "";
    let questionsWithAnswers = [];

    // Создаем массив с вопросами и ответами для голосования
    players.forEach((player, index) => {
        const questionIndex = index % questions.length; // индекс вопроса
        questionsWithAnswers.push({
            question: questions[questionIndex],
            answers: players.map(p => p.answers[questionIndex]).filter(a => a) // ответы всех игроков на данный вопрос
        });
    });

    questionsWithAnswers.forEach(q => {
        const [answer1, answer2] = q.answers;
        if (answer1 && answer2) {
            votingList.innerHTML += `
                <div>
                    <h3>${q.question}</h3>
                    <div>
                        <input type="radio" name="vote-${q.question}" value="${players[0].name}: ${answer1}"> ${players[0].name}: ${answer1}
                    </div>
                    <div>
                        <input type="radio" name="vote-${q.question}" value="${players[1].name}: ${answer2}"> ${players[1].name}: ${answer2}
                    </div>
                </div>
            `;
        }
    });

    votingScreen.style.display = "block";
}

// Обработка голосования
submitVoteBtn.addEventListener("click", () => {
    const checkedVotes = [...document.querySelectorAll('input[type="radio"]:checked')];
    if (checkedVotes.length > 0) {
        checkedVotes.forEach(vote => {
            alert(`Вы проголосовали за: ${vote.value}`);
        });
        endGame();
    } else {
        alert("Пожалуйста, выберите ответ для голосования.");
    }
});

// Завершение игры
function endGame() {
    votingScreen.style.display = "none";
    currentQuestion.textContent = "Игра окончена! Ваши ответы:";
    const answersList = document.getElementById("answers-list");
    answersList.innerHTML = "";
    players.forEach(player => {
        answersList.innerHTML += `<p>${player.name}: ${player.answers.join(", ")}</p>`;
    });
    nextQuestionBtn.style.display = "none";
    submitAnswerBtn.style.display = "none";
}
