# 🔧 Обновление API URL на Render

## Проблема: API работает, но Telegram не подключается

API работает: `https://telegram-planner-app.onrender.com/api` ✅
Но Telegram все еще использует старый URL.

## Решение: Обновите секрет VITE_API_URL

### Шаг 1: Обновите секрет в GitHub

1. Откройте: https://github.com/andreeviichm-star/telegram-planner-app/settings/secrets/actions
2. Найдите секрет `VITE_API_URL`
3. Нажмите **"Update"** (карандаш)
4. Введите новый URL:
   ```
   https://telegram-planner-app.onrender.com/api
   ```
5. Нажмите **"Update secret"**

### Шаг 2: Перезапустите GitHub Pages workflow

1. Откройте: https://github.com/andreeviichm-star/telegram-planner-app/actions
2. Найдите последний workflow run
3. Нажмите на него
4. Нажмите **"Re-run jobs"** → **"Re-run all jobs"**

Или сделайте пустой commit:
```bash
cd /Users/andreeviich/telegram-planner-app
git commit --allow-empty -m "Update API URL to Render"
git push
```

### Шаг 3: Дождитесь завершения деплоя

1. Дождитесь завершения workflow (обычно 2-3 минуты)
2. Проверьте, что деплой успешен (зеленый статус)

### Шаг 4: Проверьте в Telegram

1. Откройте приложение в Telegram
2. Откройте консоль разработчика (если возможно)
3. Проверьте, что запросы идут на новый URL:
   ```
   https://telegram-planner-app.onrender.com/api/tasks
   ```

## Если все еще не работает:

### Проверьте CORS на Render

Убедитесь, что в `backend/server.js` CORS настроен правильно:

```javascript
app.use(cors({
  origin: [
    'https://andreeviichm-star.github.io',
    'http://localhost:3000',
    'http://localhost:5173',
    /\.github\.io$/,
    /\.railway\.app$/,
    /\.netlify\.app$/,
    /\.vercel\.app$/,
    /\.onrender\.app$/  // Добавьте это!
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### Обновите бэкенд на Render

Если вы изменили CORS, нужно обновить бэкенд:

1. Сделайте commit:
   ```bash
   cd /Users/andreeviich/telegram-planner-app
   git add backend/server.js
   git commit -m "Add Render to CORS origins"
   git push
   ```

2. Render автоматически перезапустит сервис

## Проверка:

1. ✅ Секрет `VITE_API_URL` обновлен на Render URL
2. ✅ GitHub Pages workflow перезапущен
3. ✅ CORS включает `.onrender.com`
4. ✅ Бэкенд обновлен на Render

После этого приложение должно работать в Telegram!

