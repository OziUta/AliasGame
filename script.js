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
        // Простые слова (1-50)
        { word: "Кошка", hint: "Домашний питомец" },
        { word: "Собака", hint: "Лучший друг человека" },
        { word: "Дом", hint: "Место жительства" },
        { word: "Солнце", hint: "Звезда" },
        { word: "Луна", hint: "Спутник Земли" },
        { word: "Звезда", hint: "Небесное тело" },
        { word: "Вода", hint: "Жидкость" },
        { word: "Огонь", hint: "Пламя" },
        { word: "Земля", hint: "Планета" },
        { word: "Воздух", hint: "Атмосфера" },
        { word: "Дерево", hint: "Растение" },
        { word: "Цветок", hint: "Растение с лепестками" },
        { word: "Книга", hint: "Источник знаний" },
        { word: "Школа", hint: "Учебное заведение" },
        { word: "Работа", hint: "Профессиональная деятельность" },
        { word: "Друг", hint: "Близкий человек" },
        { word: "Семья", hint: "Родственники" },
        { word: "Город", hint: "Населенный пункт" },
        { word: "Деревня", hint: "Небольшое поселение" },
        { word: "Река", hint: "Водный поток" },
        { word: "Море", hint: "Большой водоём" },
        { word: "Гора", hint: "Возвышенность" },
        { word: "Лес", hint: "Много деревьев" },
        { word: "Поле", hint: "Открытое пространство" },
        { word: "Небо", hint: "Пространство над землей" },
        { word: "Облако", hint: "Скопление пара в небе" },
        { word: "Дождь", hint: "Осадки" },
        { word: "Снег", hint: "Зимние осадки" },
        { word: "Ветер", hint: "Движение воздуха" },
        { word: "Буря", hint: "Сильный ветер" },
        { word: "Еда", hint: "То, что мы едим" },
        { word: "Вода", hint: "Напиток" },
        { word: "Хлеб", hint: "Мучное изделие" },
        { word: "Молоко", hint: "Белый напиток" },
        { word: "Фрукт", hint: "Сладкий плод" },
        { word: "Овощ", hint: "Растительная пища" },
        { word: "Машина", hint: "Транспортное средство" },
        { word: "Поезд", hint: "Железнодорожный транспорт" },
        { word: "Самолет", hint: "Воздушный транспорт" },
        { word: "Корабль", hint: "Морской транспорт" },
        { word: "Велосипед", hint: "Двухколесный транспорт" },
        { word: "Дорога", hint: "Путь для транспорта" },
        { word: "Мост", hint: "Сооружение через реку" },
        { word: "Здание", hint: "Строение" },
        { word: "Окно", hint: "Проем в стене" },
        { word: "Дверь", hint: "Вход в помещение" },
        { word: "Стол", hint: "Мебель" },
        { word: "Стул", hint: "Мебель для сидения" },
        { word: "Кровать", hint: "Мебель для сна" },
        { word: "Одежда", hint: "То, что мы носим" },

        // Средней сложности (51-150)
        { word: "Телефон", hint: "Устройство связи" },
        { word: "Компьютер", hint: "Электронное устройство" },
        { word: "Интернет", hint: "Глобальная сеть" },
        { word: "Музыка", hint: "Искусство звуков" },
        { word: "Фильм", hint: "Кинокартина" },
        { word: "Театр", hint: "Место представлений" },
        { word: "Картина", hint: "Произведение искусства" },
        { word: "Фотография", hint: "Снимок" },
        { word: "Путешествие", hint: "Поездка" },
        { word: "Отдых", hint: "Свободное время" },
        { word: "Спорт", hint: "Физическая активность" },
        { word: "Игра", hint: "Развлечение" },
        { word: "Танцы", hint: "Движение под музыку" },
        { word: "Пение", hint: "Музыкальное исполнение" },
        { word: "Рисование", hint: "Создание изображений" },
        { word: "Письмо", hint: "Текст на бумаге" },
        { word: "Чтение", hint: "Восприятие текста" },
        { word: "Учеба", hint: "Получение знаний" },
        { word: "Наука", hint: "Система знаний" },
        { word: "Технология", hint: "Современные разработки" },
        { word: "Медицина", hint: "Лечение болезней" },
        { word: "Здоровье", hint: "Состояние организма" },
        { word: "Болезнь", hint: "Нарушение здоровья" },
        { word: "Лекарство", hint: "Средство лечения" },
        { word: "Больница", hint: "Медицинское учреждение" },
        { word: "Врач", hint: "Медицинский работник" },
        { word: "Учитель", hint: "Преподаватель" },
        { word: "Ученик", hint: "Тот, кто учится" },
        { word: "Профессия", hint: "Род деятельности" },
        { word: "Должность", hint: "Служебное положение" },
        { word: "Компания", hint: "Организация" },
        { word: "Бизнес", hint: "Предпринимательство" },
        { word: "Деньги", hint: "Средство оплаты" },
        { word: "Зарплата", hint: "Оплата труда" },
        { word: "Покупка", hint: "Приобретение товара" },
        { word: "Продажа", hint: "Реализация товара" },
        { word: "Магазин", hint: "Торговое заведение" },
        { word: "Рынок", hint: "Место торговли" },
        { word: "Товар", hint: "Продукт для продажи" },
        { word: "Услуга", hint: "Работа для других" },
        { word: "Клиент", hint: "Покупатель" },
        { word: "Продавец", hint: "Торговый работник" },
        { word: "Реклама", hint: "Информация о товаре" },
        { word: "Маркетинг", hint: "Продвижение товаров" },
        { word: "Экономика", hint: "Хозяйственная система" },
        { word: "Финансы", hint: "Денежные средства" },
        { word: "Банк", hint: "Финансовая организация" },
        { word: "Кредит", hint: "Заем денег" },
        { word: "Ипотека", hint: "Кредит на жилье" },
        { word: "Налоги", hint: "Обязательные платежи" },

        // Сложные слова (151-250)
        { word: "Философия", hint: "Наука о мышлении" },
        { word: "Психология", hint: "Наука о душе" },
        { word: "Социология", hint: "Наука об обществе" },
        { word: "Антропология", hint: "Наука о человеке" },
        { word: "Археология", hint: "Наука о древностях" },
        { word: "Лингвистика", hint: "Наука о языках" },
        { word: "Литература", hint: "Искусство слова" },
        { word: "Поэзия", hint: "Стихотворное творчество" },
        { word: "Проза", hint: "Нестихотворная литература" },
        { word: "Роман", hint: "Большое произведение" },
        { word: "Рассказ", hint: "Короткое произведение" },
        { word: "Повесть", hint: "Среднее произведение" },
        { word: "Драма", hint: "Театральное произведение" },
        { word: "Комедия", hint: "Веселое произведение" },
        { word: "Трагедия", hint: "Грустное произведение" },
        { word: "Мифология", hint: "Древние сказания" },
        { word: "Легенда", hint: "Народное предание" },
        { word: "Сказка", hint: "Вымышленная история" },
        { word: "Басня", hint: "Поучительный рассказ" },
        { word: "Притча", hint: "Поучительная история" },
        { word: "Аллегория", hint: "Иносказание" },
        { word: "Метафора", hint: "Слово в переносном значении" },
        { word: "Символ", hint: "Условное обозначение" },
        { word: "Абстракция", hint: "Отвлеченное понятие" },
        { word: "Концепция", hint: "Основная идея" },
        { word: "Теория", hint: "Система знаний" },
        { word: "Гипотеза", hint: "Научное предположение" },
        { word: "Эксперимент", hint: "Научный опыт" },
        { word: "Исследование", hint: "Научный поиск" },
        { word: "Анализ", hint: "Разбор на части" },
        { word: "Синтез", hint: "Соединение частей" },
        { word: "Дедукция", hint: "От общего к частному" },
        { word: "Индукция", hint: "От частного к общему" },
        { word: "Логика", hint: "Наука о мышлении" },
        { word: "Диалектика", hint: "Искусство спора" },
        { word: "Этика", hint: "Наука о морали" },
        { word: "Эстетика", hint: "Наука о прекрасном" },
        { word: "Метафизика", hint: "Философское учение" },
        { word: "Онтология", hint: "Учение о бытии" },
        { word: "Гносеология", hint: "Теория познания" },
        { word: "Аксиология", hint: "Учение о ценностях" },
        { word: "Феноменология", hint: "Философское направление" },
        { word: "Экзистенциализм", hint: "Философия существования" },
        { word: "Прагматизм", hint: "Философское течение" },
        { word: "Утопия", hint: "Вымышленное идеальное общество" },
        { word: "Антиутопия", hint: "Вымышленное плохое общество" },
        { word: "Революция", hint: "Коренной переворот" },
        { word: "Эволюция", hint: "Постепенное развитие" },
        { word: "Прогресс", hint: "Движение вперед" },
        { word: "Регресс", hint: "Движение назад" },

        // Очень сложные слова (251-350)
        { word: "Эпистемология", hint: "Теория познания" },
        { word: "Герменевтика", hint: "Искусство толкования" },
        { word: "Семиотика", hint: "Наука о знаках" },
        { word: "Структурализм", hint: "Философское направление" },
        { word: "Постструктурализм", hint: "Философское течение" },
        { word: "Деконструкция", hint: "Философский метод" },
        { word: "Трансцендентальный", hint: "Выходящий за пределы" },
        { word: "Имманентный", hint: "Внутренне присущий" },
        { word: "Ноумен", hint: "Вещь в себе" },
        { word: "Феномен", hint: "Явление" },
        { word: "Априори", hint: "До опыта" },
        { word: "Апостериори", hint: "После опыта" },
        { word: "Категорический", hint: "Безусловный" },
        { word: "Гипотетический", hint: "Предположительный" },
        { word: "Дискурс", hint: "Речевая практика" },
        { word: "Нарратив", hint: "Повествование" },
        { word: "Парадигма", hint: "Система взглядов" },
        { word: "Эпистема", hint: "Система знаний эпохи" },
        { word: "Архетип", hint: "Первообраз" },
        { word: "Ментальность", hint: "Склад мышления" },
        { word: "Когнитивный", hint: "Познавательный" },
        { word: "Перцептивный", hint: "Воспринимающий" },
        { word: "Аффективный", hint: "Эмоциональный" },
        { word: "Коннотация", hint: "Дополнительное значение" },
        { word: "Денотация", hint: "Прямое значение" },
        { word: "Синекдоха", hint: "Литературный прием" },
        { word: "Метонимия", hint: "Литературный троп" },
        { word: "Оксюморон", hint: "Сочетание несочетаемого" },
        { word: "Парадокс", hint: "Противоречие" },
        { word: "Антонимия", hint: "Противоположность" },
        { word: "Синонимия", hint: "Близость значений" },
        { word: "Омонимия", hint: "Совпадение звучания" },
        { word: "Полисемия", hint: "Многозначность" },
        { word: "Этимология", hint: "Происхождение слов" },
        { word: "Фонетика", hint: "Звуковой строй" },
        { word: "Морфология", hint: "Строение слов" },
        { word: "Синтаксис", hint: "Построение предложений" },
        { word: "Семантика", hint: "Значение слов" },
        { word: "Прагматика", hint: "Использование языка" },
        { word: "Диалект", hint: "Местная речь" },
        { word: "Идиолект", hint: "Речь отдельного человека" },
        { word: "Социолект", hint: "Речь социальной группы" },
        { word: "Жаргон", hint: "Профессиональная речь" },
        { word: "Арго", hint: "Тайный язык" },
        { word: "Эвфемизм", hint: "Смягчающее выражение" },
        { word: "Дисфемизм", hint: "Грубое выражение" },
        { word: "Табу", hint: "Запрет" },
        { word: "Эзотерический", hint: "Тайный" },
        { word: "Экзотерический", hint: "Открытый" },

        // Научные термины (351-450)
        { word: "Квантовая механика", hint: "Раздел физики" },
        { word: "Теория относительности", hint: "Физическая теория" },
        { word: "Сингулярность", hint: "Особенность в физике" },
        { word: "Черная дыра", hint: "Космический объект" },
        { word: "Темная материя", hint: "Невидимая материя" },
        { word: "Темная энергия", hint: "Загадочная энергия" },
        { word: "Большой взрыв", hint: "Теория происхождения Вселенной" },
        { word: "Инфляция", hint: "Расширение Вселенной" },
        { word: "Мультивселенная", hint: "Множество вселенных" },
        { word: "Струнная теория", hint: "Физическая теория" },
        { word: "Суперсимметрия", hint: "Физическое понятие" },
        { word: "Бозон Хиггса", hint: "Элементарная частица" },
        { word: "Нейтрино", hint: "Элементарная частица" },
        { word: "Кварк", hint: "Элементарная частица" },
        { word: "Глюон", hint: "Элементарная частица" },
        { word: "Леpton", hint: "Элементарная частица" },
        { word: "Антивещество", hint: "Противоположность веществу" },
        { word: "Аннигиляция", hint: "Превращение в энергию" },
        { word: "Энтропия", hint: "Мера беспорядка" },
        { word: "Термодинамика", hint: "Раздел физики" },
        { word: "Электромагнетизм", hint: "Физическое явление" },
        { word: "Гравитация", hint: "Сила притяжения" },
        { word: "Инерция", hint: "Свойство тел" },
        { word: "Релятивистский", hint: "Относящийся к теории относительности" },
        { word: "Квантовый", hint: "Относящийся к квантам" },
        { word: "Волновая функция", hint: "Квантовое понятие" },
        { word: "Принцип неопределенности", hint: "Квантовый принцип" },
        { word: "Суперпозиция", hint: "Квантовое состояние" },
        { word: "Запутанность", hint: "Квантовое явление" },
        { word: "Декогеренция", hint: "Квантовый процесс" },
        { word: "Криптография", hint: "Наука о шифровании" },
        { word: "Блокчейн", hint: "Технология распределенных данных" },
        { word: "Криптовалюта", hint: "Цифровые деньги" },
        { word: "Искусственный интеллект", hint: "Компьютерное мышление" },
        { word: "Машинное обучение", hint: "Раздел ИИ" },
        { word: "Нейронная сеть", hint: "Математическая модель" },
        { word: "Глубокое обучение", hint: "Метод машинного обучения" },
        { word: "Компьютерное зрение", hint: "Распознавание изображений" },
        { word: "Обработка естественного языка", hint: "Работа с текстом" },
        { word: "Большие данные", hint: "Огромные массивы информации" },
        { word: "Облачные вычисления", hint: "Удаленная обработка данных" },
        { word: "Интернет вещей", hint: "Сеть устройств" },
        { word: "Квантовые вычисления", hint: "Новый тип вычислений" },
        { word: "Биотехнология", hint: "Технология с использованием биологии" },
        { word: "Генная инженерия", hint: "Изменение ДНК" },
        { word: "Клонирование", hint: "Создание копии" },
        { word: "Крионика", hint: "Заморозка организмов" },
        { word: "Трансгуманизм", hint: "Философское движение" },
        { word: "Сингулярность технологическая", hint: "Гипотетический момент" },

        // Абстрактные понятия и эмоции (451-500)
        { word: "Ностальгия", hint: "Тоска по прошлому" },
        { word: "Меланхолия", hint: "Грустное настроение" },
        { word: "Эйфория", hint: "Состояние восторга" },
        { word: "Апатия", hint: "Безразличие" },
        { word: "Эмпатия", hint: "Сопереживание" },
        { word: "Симпатия", hint: "Расположение" },
        { word: "Антипатия", hint: "Неприязнь" },
        { word: "Ненависть", hint: "Сильная неприязнь" },
        { word: "Любовь", hint: "Сильное чувство" },
        { word: "Дружба", hint: "Отношения между людьми" },
        { word: "Предательство", hint: "Нарушение доверия" },
        { word: "Верность", hint: "Преданность" },
        { word: "Честь", hint: "Моральное качество" },
        { word: "Достоинство", hint: "Самоуважение" },
        { word: "Совесть", hint: "Моральное сознание" },
        { word: "Стыд", hint: "Чувство вины" },
        { word: "Виновность", hint: "Осознание вины" },
        { word: "Невиновность", hint: "Отсутствие вины" },
        { word: "Справедливость", hint: "Честность" },
        { word: "Несправедливость", hint: "Отсутствие справедливости" },
        { word: "Свобода", hint: "Отсутствие ограничений" },
        { word: "Независимость", hint: "Самостоятельность" },
        { word: "Зависимость", hint: "Подчиненность" },
        { word: "Ответственность", hint: "Обязанность отвечать" },
        { word: "Безответственность", hint: "Отсутствие ответственности" },
        { word: "Мужество", hint: "Смелость" },
        { word: "Трусость", hint: "Отсутствие смелости" },
        { word: "Щедрость", hint: "Готовность делиться" },
        { word: "Жадность", hint: "Чрезмерное стяжательство" },
        { word: "Скромность", hint: "Отсутствие тщеславия" },
        { word: "Тщеславие", hint: "Любовь к славе" },
        { word: "Гордость", hint: "Чувство собственного достоинства" },
        { word: "Гордыня", hint: "Чрезмерная гордость" },
        { word: "Смирение", hint: "Покорность" },
        { word: "Упрямство", hint: "Нежелание уступать" },
        { word: "Упорство", hint: "Настойчивость" },
        { word: "Надежда", hint: "Ожидание хорошего" },
        { word: "Отчаяние", hint: "Потеря надежды" },
        { word: "Вера", hint: "Убежденность" },
        { word: "Сомнение", hint: "Неуверенность" },
        { word: "Уверенность", hint: "Твердая убежденность" },
        { word: "Страх", hint: "Чувство опасности" },
        { word: "Беспокойство", hint: "Тревога" },
        { word: "Спокойствие", hint: "Отсутствие волнения" },
        { word: "Радость", hint: "Положительная эмоция" },
        { word: "Печаль", hint: "Грусть" },
        { word: "Горе", hint: "Глубокая печаль" },
        { word: "Счастье", hint: "Состояние удовлетворенности" },
        { word: "Несчастье", hint: "Отсутствие счастья" },
        { word: "Благополучие", hint: "Хорошее состояние" }
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
