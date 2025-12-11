// game.js

class ColorPuzzleGame {
    constructor() {
        // Элементы экранов
        this.loadingScreen = document.getElementById('loadingScreen');
        this.mainMenu = document.getElementById('mainMenu');
        this.gameScreen = document.getElementById('gameScreen');
        
        // Элементы меню
        this.playBtn = document.getElementById('playBtn');
        this.levelGrid = document.getElementById('levelGrid');
        this.backToMenu = document.getElementById('backToMenu');
        this.hintBtn = document.getElementById('hintBtn');
        
        // Элементы игры
        this.gridElement = document.getElementById('grid');
        this.currentColorElement = document.getElementById('currentColor');
        this.currentColorNameElement = document.getElementById('currentColorName');
        this.rValueElement = document.getElementById('rValue');
        this.gValueElement = document.getElementById('gValue');
        this.bValueElement = document.getElementById('bValue');
        this.levelElement = document.getElementById('level');
        this.movesElement = document.getElementById('moves');
        this.targetColorElement = document.getElementById('targetColor');
        this.levelNameElement = document.getElementById('levelName');
        
        // Модальные окна
        this.modal = document.getElementById('messageModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.modalMoves = document.getElementById('modalMoves');
        this.modalBest = document.getElementById('modalBest');
        this.modalRetry = document.getElementById('modalRetry');
        this.modalNext = document.getElementById('modalNext');
        this.modalIcon = document.getElementById('modalIcon');
        
        // Настройки
        this.soundToggle = document.getElementById('soundToggle');
        this.animationToggle = document.getElementById('animationToggle');
        
        // Аудио
        this.moveSound = document.getElementById('moveSound');
        this.prismSound = document.getElementById('prismSound');
        this.winSound = document.getElementById('winSound');
        this.errorSound = document.getElementById('errorSound');
        
        // Инициализация
        this.currentLevel = 1;
        this.maxLevel = 10;
        this.moves = 0;
        this.history = [];
        this.bestScores = JSON.parse(localStorage.getItem('prismBestScores')) || {};
        this.completedLevels = JSON.parse(localStorage.getItem('prismCompleted')) || [];
        this.soundEnabled = true;
        this.animationsEnabled = true;
        
        // Текущее состояние игры
        this.currentColor = { r: 255, g: 255, b: 255 };
        this.lightPosition = { x: 0, y: 0 };
        this.isMoving = false;
        
        // Определение цветов
        this.colorDefinitions = {
            'R': { name: 'красный', rgb: { r: 255, g: 0, b: 0 }, class: 'red' },
            'G': { name: 'зелёный', rgb: { r: 0, g: 255, b: 0 }, class: 'green' },
            'B': { name: 'синий', rgb: { r: 0, g: 0, b: 255 }, class: 'blue' },
            'M': { name: 'пурпурный', rgb: { r: 255, g: 0, b: 255 }, class: 'purple' },
            'Y': { name: 'жёлтый', rgb: { r: 255, g: 255, b: 0 }, class: 'yellow' },
            'C': { name: 'голубой', rgb: { r: 0, g: 255, b: 255 }, class: 'cyan' },
            'W': { name: 'белый', rgb: { r: 255, g: 255, b: 255 }, class: 'white' }
        };
        
        // 10 уровней (упрощённые)
        this.levels = {
            1: {
                name: "Основы",
                size: 5,
                grid: [
                    ['S', null, null, null, null],
                    [null, null, null, null, null],
                    [null, null, 'P_R', null, null],
                    [null, null, null, null, null],
                    [null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [4, 4],
                targetColor: 'R'
            },
            2: {
                name: "Жёлтый",
                size: 5,
                grid: [
                    ['S', null, null, null, null],
                    [null, 'P_R', null, null, null],
                    [null, null, null, 'P_G', null],
                    [null, null, null, null, null],
                    [null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [4, 4],
                targetColor: 'Y'
            },
            3: {
                name: "Фильтры",
                size: 5,
                grid: [
                    ['S', 'F_R', null, null, null],
                    [null, null, 'F_G', null, null],
                    [null, 'P_R', null, 'P_G', null],
                    [null, null, 'F_B', null, null],
                    [null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [4, 4],
                targetColor: 'Y'
            },
            4: {
                name: "Три цвета",
                size: 5,
                grid: [
                    ['S', null, 'F_M', null, null],
                    [null, 'P_R', null, 'P_B', null],
                    ['F_R', null, 'P_G', null, 'F_B'],
                    [null, 'F_Y', null, 'F_C', null],
                    [null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [4, 4],
                targetColor: 'W'
            },
            5: {
                name: "Голубой",
                size: 6,
                grid: [
                    ['S', null, 'F_R', null, 'F_G', null],
                    [null, 'P_R', null, 'P_B', null, 'F_Y'],
                    ['F_M', null, 'P_G', null, 'P_R', null],
                    [null, 'F_C', null, 'F_M', null, 'P_B'],
                    ['F_B', null, 'P_R', null, 'F_W', null],
                    [null, null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [5, 5],
                targetColor: 'C'
            },
            6: {
                name: "Лабиринт",
                size: 7,
                grid: [
                    ['S', 'F_R', null, 'F_G', null, 'F_B', null],
                    [null, null, 'P_R', null, 'P_G', null, null],
                    ['F_M', null, null, 'F_Y', null, null, 'F_C'],
                    [null, 'P_B', null, null, null, 'P_R', null],
                    ['F_R', null, 'F_W', null, 'F_M', null, 'F_G'],
                    [null, null, null, 'P_G', null, null, null],
                    [null, null, null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [6, 6],
                targetColor: 'M'
            },
            7: {
                name: "Радуга",
                size: 6,
                grid: [
                    ['S', null, null, null, null, null],
                    ['F_R', 'P_R', 'F_G', 'P_G', 'F_B', 'P_B'],
                    [null, null, null, null, null, null],
                    ['P_M', 'F_M', 'P_Y', 'F_Y', 'P_C', 'F_C'],
                    [null, null, null, null, null, null],
                    [null, null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [5, 5],
                targetColor: 'W'
            },
            8: {
                name: "Симметрия",
                size: 7,
                grid: [
                    ['S', null, null, 'F_W', null, null, null],
                    [null, 'P_R', null, null, null, 'P_B', null],
                    [null, null, 'P_G', null, 'P_G', null, null],
                    ['F_Y', null, null, null, null, null, 'F_C'],
                    [null, null, 'P_B', null, 'P_R', null, null],
                    [null, 'P_G', null, null, null, 'P_R', null],
                    [null, null, null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [6, 6],
                targetColor: 'Y'
            },
            9: {
                name: "Сеть",
                size: 8,
                grid: [
                    ['S', 'F_R', null, 'F_G', null, 'F_B', null, 'F_W'],
                    [null, null, 'P_R', null, 'P_G', null, 'P_B', null],
                    ['F_M', null, null, 'F_Y', null, null, 'F_C', null],
                    [null, 'P_B', null, null, null, 'P_R', null, null],
                    ['F_R', null, 'F_W', null, 'F_M', null, 'F_G', null],
                    [null, null, null, 'P_G', null, null, null, 'P_R'],
                    ['F_Y', null, 'P_B', null, 'P_G', null, 'F_C', null],
                    [null, null, null, null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [7, 7],
                targetColor: 'C'
            },
            10: {
                name: "Финальный",
                size: 8,
                grid: [
                    ['S', null, 'F_R', null, 'F_G', null, 'F_B', null],
                    [null, 'P_R', null, 'P_G', null, 'P_B', null, 'F_W'],
                    ['F_M', null, 'F_Y', null, 'F_C', null, 'F_W', null],
                    [null, 'P_B', null, 'P_R', null, 'P_G', null, 'P_B'],
                    ['F_W', null, 'F_C', null, 'F_Y', null, 'F_M', null],
                    [null, 'P_G', null, 'P_B', null, 'P_R', null, 'P_G'],
                    ['F_R', null, 'F_G', null, 'F_B', null, 'F_R', null],
                    [null, null, null, null, null, null, null, 'G']
                ],
                start: [0, 0],
                goal: [7, 7],
                targetColor: 'W'
            }
        };
        
        this.init();
    }
    
    async init() {
        // Симуляция загрузки
        await this.simulateLoading();
        
        // Инициализация меню
        this.initMenu();
        
        // Инициализация игры
        this.initGame();
        
        // Загрузка сохранённого прогресса
        this.loadProgress();
        
        // Переключение на главное меню
        this.switchScreen('mainMenu');
    }
    
    simulateLoading() {
        return new Promise(resolve => {
            const progressBar = document.querySelector('.loading-progress');
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(resolve, 300);
                }
            }, 100);
        });
    }
    
    initMenu() {
        // Кнопка начала игры
        this.playBtn.addEventListener('click', () => {
            this.switchScreen('gameScreen');
            this.loadLevel(this.currentLevel);
        });
        
        // Кнопка возврата в меню
        this.backToMenu.addEventListener('click', () => {
            this.switchScreen('mainMenu');
            this.updateLevelGrid();
        });
        
        // Кнопка подсказки
        this.hintBtn.addEventListener('click', () => this.showHint());
        
        // Настройки
        this.soundToggle.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            localStorage.setItem('prismSound', this.soundEnabled);
        });
        
        this.animationToggle.addEventListener('change', (e) => {
            this.animationsEnabled = e.target.checked;
            localStorage.setItem('prismAnimations', this.animationsEnabled);
        });
        
        // Загружаем настройки
        const savedSound = localStorage.getItem('prismSound');
        const savedAnimations = localStorage.getItem('prismAnimations');
        
        if (savedSound !== null) {
            this.soundEnabled = savedSound === 'true';
            this.soundToggle.checked = this.soundEnabled;
        }
        
        if (savedAnimations !== null) {
            this.animationsEnabled = savedAnimations === 'true';
            this.animationToggle.checked = this.animationsEnabled;
        }
        
        // Создаём сетку уровней
        this.updateLevelGrid();
    }
    
    updateLevelGrid() {
        this.levelGrid.innerHTML = '';
        
        for (let i = 1; i <= this.maxLevel; i++) {
            const levelBtn = document.createElement('button');
            levelBtn.className = 'level-btn';
            levelBtn.dataset.level = i;
            
            if (i === this.currentLevel) {
                levelBtn.classList.add('current');
            } else if (this.completedLevels.includes(i)) {
                levelBtn.classList.add('completed');
            } else if (i > 1 && !this.completedLevels.includes(i - 1)) {
                levelBtn.classList.add('locked');
            }
            
            levelBtn.textContent = i;
            
            if (!levelBtn.classList.contains('locked')) {
                levelBtn.addEventListener('click', () => {
                    this.currentLevel = i;
                    this.switchScreen('gameScreen');
                    this.loadLevel(i);
                });
            }
            
            this.levelGrid.appendChild(levelBtn);
        }
    }
    
    initGame() {
        // Кнопки управления
        document.getElementById('reset').addEventListener('click', () => this.resetLevel());
        document.getElementById('undo').addEventListener('click', () => this.undoMove());
        document.getElementById('prev').addEventListener('click', () => this.changeLevel(-1));
        document.getElementById('next').addEventListener('click', () => this.changeLevel(1));
        
        // Модальные кнопки
        this.modalRetry.addEventListener('click', () => {
            this.hideModal();
            this.resetLevel();
        });
        
        this.modalNext.addEventListener('click', () => {
            this.hideModal();
            this.changeLevel(1);
        });
    }
    
    loadProgress() {
        // Загружаем прогресс из localStorage
        const savedLevel = localStorage.getItem('prismCurrentLevel');
        if (savedLevel) {
            this.currentLevel = parseInt(savedLevel);
        }
    }
    
    saveProgress() {
        // Сохраняем прогресс в localStorage
        localStorage.setItem('prismCurrentLevel', this.currentLevel);
        localStorage.setItem('prismCompleted', JSON.stringify(this.completedLevels));
        localStorage.setItem('prismBestScores', JSON.stringify(this.bestScores));
    }
    
    switchScreen(screenName) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем нужный экран
        switch(screenName) {
            case 'loadingScreen':
                this.loadingScreen.classList.add('active');
                break;
            case 'mainMenu':
                this.mainMenu.classList.add('active');
                break;
            case 'gameScreen':
                this.gameScreen.classList.add('active');
                break;
        }
    }
    
    loadLevel(levelNum) {
        const level = this.levels[levelNum];
        if (!level) {
            this.showModal('Игра пройдена!', 'Вы прошли все уровни!', 'fas fa-trophy', 'success');
            return;
        }
        
        this.currentLevel = levelNum;
        this.moves = 0;
        this.history = [];
        this.currentColor = { r: 255, g: 255, b: 255 };
        this.lightPosition = { x: level.start[0], y: level.start[1] };
        
        // Обновляем UI
        this.levelElement.textContent = levelNum;
        this.levelNameElement.textContent = level.name;
        
        const targetColorDef = this.colorDefinitions[level.targetColor];
        this.targetColorElement.textContent = targetColorDef.name;
        
        this.updateColorDisplay();
        this.updateMoves();
        this.updateUndoButton();
        
        // Рендерим сетку
        this.renderGrid(level.grid);
        
        // Размещаем частицу света
        setTimeout(() => this.placeLight(level.start[0], level.start[1]), 100);
        
        // Сохраняем прогресс
        this.saveProgress();
        
        // Обновляем сетку уровней в меню
        this.updateLevelGrid();
    }
    
    renderGrid(grid) {
        this.gridElement.innerHTML = '';
        const level = this.levels[this.currentLevel];
        this.gridElement.style.gridTemplateColumns = `repeat(${level.size}, 1fr)`;
        
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.dataset.x = x;
                cellElement.dataset.y = y;
                
                if (cell) {
                    const [type, color] = cell.split('_');
                    
                    switch(type) {
                        case 'S':
                            cellElement.classList.add('start');
                            break;
                            
                        case 'G':
                            cellElement.classList.add('goal');
                            break;
                            
                        case 'P':
                            const prism = document.createElement('div');
                            prism.className = `prism ${this.getColorClass(color)}`;
                            cellElement.appendChild(prism);
                            break;
                            
                        case 'F':
                            const filter = document.createElement('div');
                            filter.className = `filter ${this.getColorClass(color)}`;
                            cellElement.appendChild(filter);
                            break;
                    }
                }
                
                cellElement.addEventListener('click', () => this.moveTo(x, y));
                this.gridElement.appendChild(cellElement);
            });
        });
    }
    
    placeLight(x, y, instant = false) {
        // Удаляем предыдущую частицу
        document.querySelectorAll('.light-particle').forEach(el => el.remove());
        
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (!cell) return;
        
        const light = document.createElement('div');
        light.className = 'light-particle';
        light.style.background = this.getColorString();
        light.style.color = this.getColorString();
        
        if (!instant && this.animationsEnabled) {
            light.style.animation = 'none';
            setTimeout(() => {
                light.style.animation = 'particleGlow 2s ease-in-out infinite';
            }, 10);
        }
        
        cell.appendChild(light);
        this.lightPosition = { x, y };
        
        // Подсвечиваем активную клетку
        document.querySelectorAll('.cell.active').forEach(c => c.classList.remove('active'));
        cell.classList.add('active');
    }
    
    async moveTo(x, y) {
        if (this.isMoving) return;
        
        const level = this.levels[this.currentLevel];
        const dx = Math.abs(x - this.lightPosition.x);
        const dy = Math.abs(y - this.lightPosition.y);
        
        // Только вертикальные и горизонтальные движения (без диагоналей)
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            // Допустимый ход
        } else {
            return; // Неправильное направление
        }
        
        const targetCell = level.grid[y][x];
        
        // Проверяем фильтр
        if (targetCell && targetCell.startsWith('F_')) {
            const filterColor = targetCell.split('_')[1];
            if (!this.canPassFilter(filterColor)) {
                this.shakeCell(x, y);
                this.playSound(this.errorSound);
                return;
            }
        }
        
        // Сохраняем состояние для отмены
        this.history.push({
            position: { ...this.lightPosition },
            color: { ...this.currentColor },
            moves: this.moves
        });
        this.updateUndoButton();
        
        this.moves++;
        this.updateMoves();
        
        // Анимируем движение
        await this.animateMove(x, y);
        
        // Применяем эффект призмы
        if (targetCell && targetCell.startsWith('P_')) {
            const prismColor = targetCell.split('_')[1];
            await this.applyPrism(prismColor, x, y);
        }
        
        // Проверяем цель
        if (targetCell === 'G') {
            await this.checkGoal(x, y);
        }
    }
    
    animateMove(x, y) {
        return new Promise(resolve => {
            this.isMoving = true;
            this.playSound(this.moveSound);
            
            if (this.animationsEnabled) {
                // Анимация через Web Animations API
                const light = document.querySelector('.light-particle');
                if (light) {
                    light.animate([
                        { transform: 'scale(1)', opacity: 1 },
                        { transform: 'scale(0.7)', opacity: 0.7 },
                        { transform: 'scale(1)', opacity: 1 }
                    ], {
                        duration: 200,
                        easing: 'ease-in-out'
                    });
                }
                
                setTimeout(() => {
                    this.placeLight(x, y);
                    this.isMoving = false;
                    resolve();
                }, 200);
            } else {
                // Без анимации
                this.placeLight(x, y, true);
                this.isMoving = false;
                resolve();
            }
        });
    }
    
    mixColors(currentColor, prismColor) {
        const prismRGB = this.colorDefinitions[prismColor].rgb;
        
        let newColor = { ...currentColor };
        
        if (this.isWhite()) {
            // Белый свет становится цветом призмы
            newColor = { ...prismRGB };
        } else {
            // Аддитивное смешение цветов
            newColor.r = Math.min(255, currentColor.r + prismRGB.r);
            newColor.g = Math.min(255, currentColor.g + prismRGB.g);
            newColor.b = Math.min(255, currentColor.b + prismRGB.b);
        }
        
        return newColor;
    }
    
    isSpecificColor(targetColorCode) {
        const targetRGB = this.colorDefinitions[targetColorCode]?.rgb;
        if (!targetRGB) return false;
        
        return this.currentColor.r === targetRGB.r &&
               this.currentColor.g === targetRGB.g &&
               this.currentColor.b === targetRGB.b;
    }
    
    getCurrentColorName() {
        // Проверяем основные цвета
        for (const [code, def] of Object.entries(this.colorDefinitions)) {
            if (this.isSpecificColor(code)) {
                return def.name;
            }
        }
        
        // Если это смешанный цвет
        const components = [];
        if (this.currentColor.r > 0) components.push('красный');
        if (this.currentColor.g > 0) components.push('зелёный');
        if (this.currentColor.b > 0) components.push('синий');
        
        if (components.length === 0) return 'чёрный';
        if (components.length === 3) return 'белый';
        
        return components.join('+');
    }
    
    async applyPrism(color, x, y) {
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        const prism = cell?.querySelector('.prism');
        
        if (!prism) return;
        
        // Сохраняем старый цвет для анимации
        const oldColor = this.getColorString();
        
        // Анимация призмы
        if (this.animationsEnabled) {
            prism.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(1.3)', opacity: 0.8 },
                { transform: 'scale(1)', opacity: 1 }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
        }
        
        // Смешиваем цвета
        setTimeout(() => {
            const newColor = this.mixColors(this.currentColor, color);
            this.playSound(this.prismSound);
            
            if (this.animationsEnabled) {
                // Анимация перехода цвета
                const light = document.querySelector('.light-particle');
                if (light) {
                    light.animate([
                        { background: oldColor },
                        { background: this.getRGBString(newColor) }
                    ], {
                        duration: 300,
                        easing: 'ease-in-out',
                        fill: 'forwards'
                    });
                }
                
                setTimeout(() => {
                    this.currentColor = newColor;
                    this.updateColorDisplay();
                }, 300);
            } else {
                this.currentColor = newColor;
                this.updateColorDisplay();
            }
        }, 150);
    }
    
    canPassFilter(filterColor) {
        const filterRGB = this.colorDefinitions[filterColor]?.rgb;
        if (!filterRGB) return false;
        
        // Фильтр пропускает свет, если у света есть ВСЕ компоненты фильтра
        const channels = ['r', 'g', 'b'];
        for (const channel of channels) {
            if (filterRGB[channel] > 0) {
                if (this.currentColor[channel] === 0) {
                    return false;
                }
            } else {
                if (this.currentColor[channel] > 0) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    async checkGoal(x, y) {
        const level = this.levels[this.currentLevel];
        const goalPos = level.goal;
        
        if (x !== goalPos[0] || y !== goalPos[1]) return;
        
        // Проверяем соответствие целевого цвета
        const targetColorCode = level.targetColor;
        const isCorrectColor = this.isSpecificColor(targetColorCode);
        
        if (isCorrectColor) {
            // Эффект победы
            this.playSound(this.winSound);
            
            // Добавляем уровень в пройденные
            if (!this.completedLevels.includes(this.currentLevel)) {
                this.completedLevels.push(this.currentLevel);
            }
            
            // Сохраняем лучший результат
            const levelKey = `level${this.currentLevel}`;
            if (!this.bestScores[levelKey] || this.moves < this.bestScores[levelKey]) {
                this.bestScores[levelKey] = this.moves;
            }
            
            // Сохраняем прогресс
            this.saveProgress();
            
            // Показываем сообщение об успехе
            setTimeout(() => {
                const targetColorName = this.colorDefinitions[targetColorCode].name;
                this.showModal(
                    'Уровень пройден!', 
                    `Цель: ${targetColorName}\nХодов: ${this.moves}`,
                    'fas fa-trophy',
                    'success'
                );
                
                this.modalMoves.textContent = this.moves;
                this.modalBest.textContent = this.bestScores[levelKey] || '-';
            }, 500);
        } else {
            this.shakeCell(x, y);
            this.playSound(this.errorSound);
            const targetColorName = this.colorDefinitions[targetColorCode].name;
            const currentColorName = this.getCurrentColorName();
            this.showModal(
                'Не тот цвет!', 
                `Нужен: ${targetColorName}\nУ вас: ${currentColorName}`,
                'fas fa-palette',
                'warning'
            );
        }
    }
    
    shakeCell(x, y) {
        if (!this.animationsEnabled) return;
        
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (!cell) return;
        
        cell.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(8px)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(0)' }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        });
    }
    
    showHint() {
        const level = this.levels[this.currentLevel];
        const targetColor = this.colorDefinitions[level.targetColor];
        
        let hintText = `Цель: ${targetColor.name}\n\n`;
        hintText += "Смешение цветов:\n";
        hintText += "• Красный + Зелёный = Жёлтый\n";
        hintText += "• Красный + Синий = Пурпурный\n";
        hintText += "• Зелёный + Синий = Голубой\n";
        hintText += "• Все три цвета = Белый";
        
        this.showModal('Подсказка', hintText, 'fas fa-lightbulb', 'info');
    }
    
    isWhite() {
        return this.currentColor.r === 255 && 
               this.currentColor.g === 255 && 
               this.currentColor.b === 255;
    }
    
    undoMove() {
        if (this.history.length === 0 || this.isMoving) return;
        
        const lastState = this.history.pop();
        this.lightPosition = lastState.position;
        this.currentColor = lastState.color;
        this.moves = lastState.moves;
        
        this.updateColorDisplay();
        this.updateMoves();
        this.updateUndoButton();
        this.placeLight(this.lightPosition.x, this.lightPosition.y, true);
    }
    
    updateUndoButton() {
        const undoBtn = document.getElementById('undo');
        undoBtn.disabled = this.history.length === 0;
    }
    
    updateColorDisplay() {
        const colorStr = this.getColorString();
        this.currentColorElement.style.background = colorStr;
        this.currentColorElement.style.boxShadow = `0 0 20px ${colorStr}`;
        
        this.rValueElement.textContent = this.currentColor.r;
        this.gValueElement.textContent = this.currentColor.g;
        this.bValueElement.textContent = this.currentColor.b;
        
        // Обновляем название цвета
        this.currentColorNameElement.textContent = this.getCurrentColorName();
        this.currentColorNameElement.style.color = colorStr;
    }
    
    updateMoves() {
        this.movesElement.textContent = this.moves;
    }
    
    getColorString() {
        return `rgb(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b})`;
    }
    
    getRGBString(rgb) {
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    
    getColorClass(colorCode) {
        const colorDef = this.colorDefinitions[colorCode];
        return colorDef ? colorDef.class : 'red';
    }
    
    showModal(title, message, icon, type) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modalIcon.className = icon;
        this.modal.style.display = 'flex';
        
        // Настраиваем цвет в зависимости от типа
        const colors = {
            'success': '#10b981',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        
        this.modalIcon.style.color = colors[type] || colors.info;
    }
    
    hideModal() {
        this.modal.style.display = 'none';
    }
    
    resetLevel() {
        this.loadLevel(this.currentLevel);
    }
    
    changeLevel(delta) {
        const newLevel = this.currentLevel + delta;
        if (newLevel >= 1 && newLevel <= Object.keys(this.levels).length) {
            this.loadLevel(newLevel);
        } else if (newLevel > Object.keys(this.levels).length) {
            this.switchScreen('mainMenu');
            this.updateLevelGrid();
        }
    }
    
    playSound(sound) {
        if (!this.soundEnabled || !sound) return;
        
        try {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        } catch (e) {
            // Игнорируем ошибки аудио
        }
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const game = new ColorPuzzleGame();
    
    // Закрытие модального окна по клику вне его
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('messageModal')) {
            game.hideModal();
        }
    });
    
    // Обработка свайпов для мобильных
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        // Минимальная дистанция для свайпа
        if (Math.abs(dx) > 50 && Math.abs(dy) < 50) {
            if (dx > 0) {
                game.changeLevel(-1); // Свайп вправо - предыдущий уровень
            } else {
                game.changeLevel(1); // Свайп влево - следующий уровень
            }
        }
    }, { passive: true });
    
    // Предотвращение масштабирования на мобильных
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
});
