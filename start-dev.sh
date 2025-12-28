#!/bin/bash

# Скрипт для быстрого запуска приложения в режиме разработки

echo "🚀 Запуск Telegram Mini App..."

# Проверка наличия ngrok
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok не установлен!"
    echo "Установите ngrok:"
    echo "  brew install ngrok"
    echo "  или скачайте с https://ngrok.com/download"
    exit 1
fi

# Проверка установленных зависимостей
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Установка зависимостей frontend..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Установка зависимостей backend..."
    cd backend && npm install && cd ..
fi

# Создание .env файлов если их нет
if [ ! -f "frontend/.env" ]; then
    echo "📝 Создание frontend/.env..."
    echo "VITE_API_URL=http://localhost:3001/api" > frontend/.env
fi

# Запуск backend в фоне
echo "🔧 Запуск backend на порту 3001..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Ожидание запуска backend
sleep 3

# Запуск frontend в фоне
echo "🎨 Запуск frontend на порту 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Ожидание запуска frontend
sleep 5

# Запуск ngrok
echo "🌐 Запуск ngrok туннеля..."
ngrok http 3000 &
NGROK_PID=$!

sleep 3

echo ""
echo "✅ Приложение запущено!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend: http://localhost:3001"
echo ""
echo "🌐 Получите HTTPS URL из ngrok:"
echo "   Откройте http://localhost:4040 в браузере"
echo ""
echo "📱 Затем обновите Web App URL в BotFather:"
echo "   1. Откройте @BotFather в Telegram"
echo "   2. Отправьте /myapps"
echo "   3. Выберите ваше приложение"
echo "   4. Edit → Web App URL"
echo "   5. Вставьте HTTPS URL от ngrok"
echo ""
echo "⚠️  Для остановки нажмите Ctrl+C"

# Ожидание сигнала завершения
trap "kill $BACKEND_PID $FRONTEND_PID $NGROK_PID 2>/dev/null; exit" INT TERM

# Ожидание завершения
wait

