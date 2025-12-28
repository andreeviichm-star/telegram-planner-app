# Инструкция по запуску в Telegram

## Шаг 1: Создание Telegram бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям:
   - Введите имя бота (например: "Мой Планировщик")
   - Введите username бота (должен заканчиваться на `bot`, например: `my_planner_bot`)
4. Сохраните токен бота (выглядит как `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Шаг 2: Создание Mini App

1. В том же чате с BotFather отправьте команду `/newapp`
2. Выберите вашего бота из списка
3. Заполните информацию:
   - **Title**: Планировщик задач
   - **Short name**: planner (будет использоваться в URL)
   - **Description**: Планировщик задач и дневник
   - **Photo**: (опционально) загрузите иконку
   - **Animation**: (опционально) GIF анимация
   - **Web App URL**: **пока оставьте пустым, заполним позже**

## Шаг 3: Локальный запуск (для разработки)

### Вариант A: Использование ngrok (рекомендуется)

1. Установите ngrok:
   ```bash
   # macOS
   brew install ngrok
   
   # Или скачайте с https://ngrok.com/download
   ```

2. Запустите frontend:
   ```bash
   cd /Users/andreeviich/telegram-planner-app
   cd frontend
   npm install
   npm run dev
   ```
   Frontend будет доступен на `http://localhost:3000`

3. В другом терминале запустите ngrok:
   ```bash
   ngrok http 3000
   ```

4. Скопируйте HTTPS URL из ngrok (например: `https://abc123.ngrok.io`)

5. Обновите Web App URL в BotFather:
   - Отправьте `/myapps` в BotFather
   - Выберите ваше приложение
   - Выберите "Edit" → "Web App URL"
   - Вставьте URL от ngrok: `https://abc123.ngrok.io`

6. Запустите backend (в третьем терминале):
   ```bash
   cd /Users/andreeviich/telegram-planner-app/backend
   npm install
   npm run dev
   ```

7. Обновите переменную окружения frontend:
   ```bash
   # Создайте файл frontend/.env
   echo "VITE_API_URL=http://localhost:3001/api" > frontend/.env
   ```
   
   Если backend тоже через ngrok, используйте его URL:
   ```bash
   # Запустите ngrok для backend на порту 3001
   ngrok http 3001
   
   # Обновите frontend/.env с URL от ngrok
   echo "VITE_API_URL=https://xyz789.ngrok.io/api" > frontend/.env
   ```

### Вариант B: Использование локального туннеля (альтернатива)

Можно использовать другие сервисы:
- **Cloudflare Tunnel**: `cloudflared tunnel --url http://localhost:3000`
- **LocalTunnel**: `npx localtunnel --port 3000`

## Шаг 4: Деплой (для продакшена)

### Frontend (Vercel - рекомендуется)

1. Установите Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Войдите в Vercel:
   ```bash
   vercel login
   ```

3. Деплой frontend:
   ```bash
   cd frontend
   vercel
   ```

4. После деплоя получите URL (например: `https://your-app.vercel.app`)

5. Настройте переменные окружения в Vercel Dashboard:
   - `VITE_API_URL` = URL вашего backend API

### Backend (Railway - рекомендуется)

1. Зарегистрируйтесь на [Railway.app](https://railway.app)
2. Создайте новый проект
3. Подключите GitHub репозиторий или загрузите код
4. Настройте:
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT=3001`
     - `NODE_ENV=production`

5. Получите URL вашего API (например: `https://your-app.railway.app`)

6. Обновите `VITE_API_URL` в Vercel на URL от Railway

### Альтернативные платформы

**Frontend:**
- Netlify
- GitHub Pages
- Cloudflare Pages

**Backend:**
- Heroku
- Render
- Fly.io

## Шаг 5: Подключение к Telegram

1. После настройки Web App URL в BotFather, откройте вашего бота в Telegram
2. Нажмите на кнопку меню (три полоски) или отправьте команду `/start`
3. Если все настроено правильно, вы увидите кнопку "Open App" или "Launch App"
4. Нажмите на неё - откроется ваше Mini App!

## Шаг 6: Тестирование

1. Убедитесь, что:
   - Frontend доступен по HTTPS
   - Backend API работает
   - CORS настроен правильно (уже настроен в `backend/server.js`)

2. Проверьте в браузере:
   - Откройте DevTools (F12)
   - Проверьте консоль на ошибки
   - Проверьте Network tab - запросы к API должны проходить

## Быстрый старт (локально)

```bash
# 1. Установите зависимости
cd /Users/andreeviich/telegram-planner-app
npm run install:all

# 2. Запустите backend
cd backend
npm run dev
# Backend на http://localhost:3001

# 3. В другом терминале - запустите frontend
cd frontend
npm run dev
# Frontend на http://localhost:3000

# 4. В третьем терминале - запустите ngrok для frontend
ngrok http 3000

# 5. Скопируйте HTTPS URL от ngrok и обновите в BotFather
# /myapps → выберите приложение → Edit → Web App URL
```

## Полезные команды BotFather

- `/mybots` - список ваших ботов
- `/myapps` - список ваших Mini Apps
- `/setmenubutton` - настройка кнопки меню бота
- `/setdescription` - описание бота
- `/setabouttext` - информация о боте

## Решение проблем

### Приложение не открывается
- Проверьте, что URL использует HTTPS
- Убедитесь, что URL доступен из интернета
- Проверьте консоль браузера на ошибки

### API не работает
- Проверьте CORS настройки
- Убедитесь, что backend запущен
- Проверьте переменную окружения `VITE_API_URL`

### Ошибки в консоли
- Откройте DevTools в Telegram (нажмите на приложение долго → "Inspect Element")
- Проверьте Network tab
- Проверьте Console на ошибки

## Дополнительные настройки

### Настройка кнопки меню бота

В BotFather:
```
/setmenubutton
→ Выберите бота
→ Text: Открыть планировщик
→ Web App: выберите ваше приложение
```

Теперь пользователи увидят кнопку в меню бота!

