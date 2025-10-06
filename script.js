class AliasGame {
    constructor() {
        this.words = [];
        this.teams = [];
        this.currentTeamIndex = 0;
        this.currentWordIndex = 0;
        this.correctWords = [];
        this.skippedWords = [];
        this.timeLeft = 60;
        this.timerInterval = null;
        this.isPaused = false;
        this.gameStarted = false;
        this.totalGames = 0;
        
        this.init();
    }

    async init() {
        await this.loadWords();
        this.loadStats();
        this.bindEvents();
        this.initTelegram();
        
        // Имитация загрузки
        setTimeout(() => {
            this.showMainMenu();
        }, 2000);
    }

    async loadWords() {
        this.words = [
            { word: "Телефон", hint: "Устройство связи" },
            { word: "Солнце", hint: "Звезда" },
            { word: "Книга", hint: "Источник знаний" },
            { word: "Музыка", hint: "Искусство звуков" },
            { word: "Спорт", hint: "Физическая активность" },
            { word: "Путешествие", hint: "Поездка в другую страну" },
            { word: "Еда", hint: "То, что мы едим" },
            { word: "Дружба", hint: "Отношения между людьми" },
            { word: "Любовь", hint: "Сильное чувство" },
            { word: "Работа", hint: "Профессиональная деятельность" },
            { word: "Школа", hint: "Учебное заведение" },
            { word: "Компьютер", hint: "Электронное устройство" },
            { word: "Фильм", hint: "Кинокартина" },
            { word: "Игра", hint: "Развлечение" },
            { word: "Город", hint: "Населенный пункт" },
            { word: "Море", hint: "Большой водоём" },
            { word: "Гора", hint: "Возвышенность" },
            { word: "Лес", hint: "Много деревьев" },
            { word: "Животное", hint: "Не человек" },
            { word: "Растение", hint: "Флора" }
        ];
    }

    loadStats() {
        this.totalGames = parseInt(localStorage.getItem('alias_total_games') || '0');
        this.updateStatsDisplay();
    }

    saveStats() {
        localStorage.setItem('alias_total_games', this.totalGames.toString());
    }

    updateStatsDisplay() {
        document.getElementById('totalGames').textContent = this.totalGames;
    }

    initTelegram() {
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            
            const themeParams = Telegram.WebApp.themeParams;
            document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color || '#667eea');
            document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color || '#333');
        }
    }

    bindEvents() {
        // Главное меню
        document.getElementById('startGameBtn').addEventListener('click', () => this.showSetupScreen());
        document.getElementById('aboutBtn').addEventListener('click', () => this.showAboutScreen());
        
        // Экран "Об игре"
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.showMainMenu());
        
        // Настройки
        document.getElementById('backToMenuFromSetup').addEventListener('click', () => this.showMainMenu());
        document.getElementById('addTeam').addEventListener('click', () => this.addTeam());
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        
        // Игра
        document.getElementById('correctBtn').addEventListener('click', () => this.correctWord());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipWord());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        
        // Пауза
        document.getElementById('resumeBtn').addEventListener('click', () => this.resumeGame());
        document.getElementById('endGameBtn').addEventListener('click', () => this.endGame());
        
        // Результаты
        document.getElementById('newGameBtn').addEventListener('click', () => this.showSetupScreen());
        document.getElementById('backToMenuFromResults').addEventListener('click', () => this.showMainMenu());
    }

    // Управление экранами
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showLoadingScreen() {
        this.showScreen('loadingScreen');
    }

    showMainMenu() {
        this.showScreen('mainMenuScreen');
        this.updateStatsDisplay();
    }

    showAboutScreen() {
        this.showScreen('aboutScreen');
    }

    showSetupScreen() {
        this.showScreen('setupScreen');
        this.initializeDefaultTeams();
    }

    showGameScreen() {
        this.showScreen('gameScreen');
    }

    showPauseScreen() {
        this.updatePauseStats();
        this.showScreen('pauseScreen');
    }

    showResultsScreen() {
        this.showScreen('resultsScreen');
        this.displayResults();
    }

    // Логика игры
    initializeDefaultTeams() {
        const teamsContainer = document.getElementById('teams');
        teamsContainer.innerHTML = `
            <div class="team">
                <input type="text" class="team-name" value="Команда 1" placeholder="Название команды">
                <span class="score">0</span>
                <button class="btn-remove-team">×</button>
            </div>
            <div class="team">
                <input type="text" class="team-name" value="Команда 2" placeholder="Название команды">
                <span class="score">0</span>
                <button class="btn-remove-team">×</button>
            </div>
        `;
        
        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.btn-remove-team').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (document.querySelectorAll('.team').length > 1) {
                    e.target.closest('.team').remove();
                }
            });
        });
    }

    addTeam() {
        const teamsContainer = document.getElementById('teams');
        const teamCount = teamsContainer.children.length + 1;
        
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';
        teamDiv.innerHTML = `
            <input type="text" class="team-name" value="Команда ${teamCount}" placeholder="Название команды">
            <span class="score">0</span>
            <button class="btn-remove-team">×</button>
        `;
        
        teamsContainer.appendChild(teamDiv);
        
        // Добавляем обработчик для новой кнопки удаления
        teamDiv.querySelector('.btn-remove-team').addEventListener('click', (e) => {
            if (document.querySelectorAll('.team').length > 1) {
                e.target.closest('.team').remove();
            }
        });
    }

    startGame() {
        this.setupTeams();
        if (this.teams.length === 0) {
            alert('Добавьте хотя бы одну команду!');
            return;
        }

        this.gameStarted = true;
        this.currentTeamIndex = 0;
        this.correctWords = [];
        this.skippedWords = [];
        
        const roundTime = parseInt(document.getElementById('roundTime').value);
        this.timeLeft = roundTime;
        
        this.totalGames++;
        this.saveStats();
        
        this.showGameScreen();
        this.nextWord();
        this.startTimer();
    }

    setupTeams() {
        this.teams = [];
        const teamElements = document.querySelectorAll('.team');
        
        teamElements.forEach(teamEl => {
            const name = teamEl.querySelector('.team-name').value || `Команда ${this.teams.length + 1}`;
            this.teams.push({
                name: name,
                score: 0,
                element: teamEl
            });
        });
    }

    updateGameInfo() {
        const currentTeam = this.teams[this.currentTeamIndex];
        document.getElementById('currentTeamName').textContent = currentTeam.name;
        document.getElementById('currentScore').textContent = `Счёт: ${currentTeam.score}`;
        document.getElementById('timer').textContent = this.timeLeft;
        
        const wordsToWin = parseInt(document.getElementById('wordsToWin').value);
        const progress = (currentTeam.score / wordsToWin) * 100;
        document.getElementById('progressFill').style.width = `${Math.min(progress, 100)}%`;
        document.getElementById('progressText').textContent = `${currentTeam.score}/${wordsToWin}`;
        
        // Обновляем таймер
        const timerElement = document.getElementById('timer');
        if (this.timeLeft <= 10) {
            timerElement.classList.add('warning');
        } else {
            timerElement.classList.remove('warning');
        }
    }

    nextWord() {
        if (this.words.length === 0) return;
        
        this.currentWordIndex = Math.floor(Math.random() * this.words.length);
        const currentWord = this.words[this.currentWordIndex];
        
        document.getElementById('currentWord').textContent = currentWord.word;
        document.getElementById('wordHint').textContent = currentWord.hint ? `Подсказка: ${currentWord.hint}` : '';
        
        document.getElementById('currentWord').classList.add('pulse');
        setTimeout(() => {
            document.getElementById('currentWord').classList.remove('pulse');
        }, 500);
    }

    correctWord() {
        const currentTeam = this.teams[this.currentTeamIndex];
        currentTeam.score++;
        this.correctWords.push(this.words[this.currentWordIndex].word);
        
        this.animateScoreChange('+1');
        this.checkWinCondition();
        this.nextWord();
        this.updateGameInfo();
    }

    skipWord() {
        const currentTeam = this.teams[this.currentTeamIndex];
        
        // Вычитаем очко, но не меньше 0
        if (currentTeam.score > 0) {
            currentTeam.score--;
            this.animateScoreChange('-1');
        }
        
        this.skippedWords.push(this.words[this.currentWordIndex].word);
        this.nextWord();
        this.updateGameInfo();
    }

    animateScoreChange(change) {
        const scoreElement = document.querySelector(`#teams .team:nth-child(${this.currentTeamIndex + 1}) .score`);
        scoreElement.textContent = this.teams[this.currentTeamIndex].score;
        scoreElement.classList.add('score-change');
        setTimeout(() => {
            scoreElement.classList.remove('score-change');
        }, 300);
    }

    checkWinCondition() {
        const wordsToWin = parseInt(document.getElementById('wordsToWin').value);
        const currentTeam = this.teams[this.currentTeamIndex];
        
        if (currentTeam.score >= wordsToWin) {
            this.endRound();
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!this.isPaused && this.gameStarted) {
                this.timeLeft--;
                this.updateGameInfo();
                
                if (this.timeLeft <= 0) {
                    this.endRound();
                }
            }
        }, 1000);
    }

    endRound() {
        clearInterval(this.timerInterval);
        
        this.currentTeamIndex++;
        if (this.currentTeamIndex >= this.teams.length) {
            this.showResultsScreen();
        } else {
            const roundTime = parseInt(document.getElementById('roundTime').value);
            this.timeLeft = roundTime;
            this.correctWords = [];
            this.skippedWords = [];
            this.updateGameInfo();
            this.nextWord();
            this.startTimer();
        }
    }

    updatePauseStats() {
        document.getElementById('pauseCorrect').textContent = this.correctWords.length;
        document.getElementById('pauseSkipped').textContent = this.skippedWords.length;
    }

    pauseGame() {
        this.isPaused = true;
        this.showPauseScreen();
    }

    resumeGame() {
        this.isPaused = false;
        this.showGameScreen();
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.gameStarted = false;
        this.showResultsScreen();
    }

    displayResults() {
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';
        
        const sortedTeams = [...this.teams].sort((a, b) => b.score - a.score);
        const maxScore = sortedTeams[0].score;
        
        sortedTeams.forEach((team, index) => {
            const teamResult = document.createElement('div');
            teamResult.className = `team-result ${team.score === maxScore && maxScore > 0 ? 'winner' : ''}`;
            teamResult.innerHTML = `
                <span>${team.name}</span>
                <span class="score">${team.score} очков</span>
            `;
            resultsList.appendChild(teamResult);
        });
    }
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    new AliasGame();
});