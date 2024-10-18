const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування для статичних файлів
app.use(express.static(path.join(__dirname, 'public')));

// Головний маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
