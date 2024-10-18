const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});

// Гра
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let totalClicks = 0;
let pointsPerClick = 1;
let musicEnabled = true;
let soundEffectsEnabled = true;

const upgrades = [
    { name: 'Апгрейд 1', cost: 10, increment: 1 },
    { name: 'Апгрейд 2', cost: 20, increment: 2 },
    { name: 'Апгрейд 3', cost: 50, increment: 5 },
    { name: 'Спеціальний апгрейд', cost: 100, increment: 10, unlocked: false }
];

const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('clickButton');
const upgradeButton = document.getElementById('upgradeButton');
const upgradesContainer = document.getElementById('upgrades');
const upgradesSection = document.getElementById('upgradesSection');
const gameSection = document.getElementById('gameSection');
const loginSection = document.getElementById('loginSection');
const backButton = document.getElementById('backButton');
const settingsButton = document.getElementById('settingsButton');
const settingsSection = document.getElementById('settingsSection');
const musicToggle = document.getElementById('musicToggle');
const soundEffectsToggle = document.getElementById('soundEffectsToggle');
const resetButton = document.getElementById('resetButton');
const backgroundMenuButton = document.getElementById('backgroundMenuButton');
const backToGameFromSettings = document.getElementById('backToGameFromSettings');
const backgroundMenu = document.getElementById('backgroundMenu');
const backToSettingsButton = document.getElementById('backToSettingsButton');
const backgroundOptions = document.getElementById('backgroundOptions');

const backgroundMusic = document.getElementById('backgroundMusic');
const clickSound = document.getElementById('clickSound');

scoreDisplay.textContent = score;

// Збереження прогресу
const saveProgress = () => {
    localStorage.setItem('score', score);
};

// Автоматичне зберігання прогресу
setInterval(saveProgress, 5000);

// Фонове музичне супроводження
const toggleBackgroundMusic = () => {
    if (musicEnabled) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
};

// Обробка кліків
clickButton.addEventListener('click', () => {
    if (soundEffectsEnabled) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
    
    score += pointsPerClick;
    totalClicks++;
    scoreDisplay.textContent = score;

    if (totalClicks === 1000) {
        upgrades[3].unlocked = true;
        updateUpgrades();
        alert('Вітаємо! Ви відкрили спеціальний апгрейд!');
    }
});

// Купівля апгрейдів
const buyUpgrade = (upgrade) => {
    if (score >= upgrade.cost) {
        score -= upgrade.cost;
        pointsPerClick += upgrade.increment;
        scoreDisplay.textContent = score;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        updateUpgrades();
    }
};

// Оновлення апгрейдів
const updateUpgrades = () => {
    upgradesContainer.innerHTML = '';
    upgrades.forEach(upgrade => {
        const button = document.createElement('button');
        button.className = 'upgrade';
        
        const canAfford = score >= upgrade.cost;
        button.textContent = `${upgrade.name} (${upgrade.cost} балів, +${upgrade.increment} на клік)`;
        
        if (!canAfford) {
            button.textContent += ' 🔒';
            button.disabled = true;
        } else {
            button.onclick = () => buyUpgrade(upgrade);
        }
        
        upgradesContainer.appendChild(button);
    });
};

// Перемикач музики
musicToggle.addEventListener('change', () => {
    musicEnabled = musicToggle.checked;
    toggleBackgroundMusic();
});

// Перемикач звукових ефектів
soundEffectsToggle.addEventListener('change', () => {
    soundEffectsEnabled = soundEffectsToggle.checked;
});

// Обробники кнопок
upgradeButton.addEventListener('click', () => {
    gameSection.style.display = 'none';
    upgradesSection.style.display = 'block';
    updateUpgrades();
});

backButton.addEventListener('click', () => {
    upgradesSection.style.display = 'none';
    gameSection.style.display = 'block';
});

settingsButton.addEventListener('click', () => {
    gameSection.style.display = 'none';
    settingsSection.style.display = 'block';
});

backgroundMenuButton.addEventListener('click', () => {
    settingsSection.style.display = 'none';
    backgroundMenu.style.display = 'block';
    updateBackgroundOptions();
});

backToGameFromSettings.addEventListener('click', () => {
    settingsSection.style.display = 'none';
    gameSection.style.display = 'block';
});

// Скидання прогресу
resetButton.addEventListener('click', () => {
    score = 0;
    pointsPerClick = 1;
    upgrades.forEach(upgrade => {
        upgrade.cost = 10;
        upgrade.unlocked = false;
    });
    totalClicks = 0;
    scoreDisplay.textContent = score;
    saveProgress();
    updateUpgrades();
});

// Зміна фону
const updateBackgroundOptions = () => {
    backgroundOptions.innerHTML = '';

    const backgrounds = [
        { name: 'Стандартний', value: 'default' },
        { name: 'Фон 1', value: 'bg1' },
        { name: 'Фон 2', value: 'bg2' },
        { name: 'Фон 3', value: 'bg3' },
        { name: 'Фон 4', value: 'bg4' }
    ];

    backgrounds.forEach(bg => {
        const button = document.createElement('button');
        button.className = 'background-option';
        button.textContent = bg.name;
        button.onclick = () => {
            document.body.className = bg.value;
        };
        backgroundOptions.appendChild(button);
    });
};

// Повернення до налаштувань
backToSettingsButton.addEventListener('click', () => {
    backgroundMenu.style.display = 'none';
    settingsSection.style.display = 'block';
});

// Обробка авторизації через Telegram
const telegramLoginButton = document.getElementById('telegramLoginButton');

telegramLoginButton.addEventListener('click', () => {
    const botToken = '7970599797:AAGIvZjUP89h4Kq_rJ1SrgDTmMvkZ99V2ek'; // Вставте токен вашого бота
    const telegramLoginUrl = `https://telegram.me/${botToken}?start=auth`;
    window.location.href = telegramLoginUrl;
});

// Запуск фонової музики при завантаженні
window.onload = () => {
    toggleBackgroundMusic();
};
