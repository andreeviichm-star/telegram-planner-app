# ⚡ Быстрый деплой за 10 минут

## Что нужно:
- GitHub аккаунт (бесплатно)
- 10 минут времени

---

## Шаг 1: Загрузите код на GitHub

```bash
cd /Users/andreeviich/telegram-planner-app

# Инициализируйте git (если еще не сделано)
git init
git add .
git commit -m "Initial commit"

# Создайте репозиторий на github.com и выполните:
git remote add origin https://github.com/ваш-username/telegram-planner-app.git
git branch -M main
git push -u origin main
```

---

## Шаг 2: Деплой Backend на Railway (5 минут)

1. Откройте [railway.app](https://railway.app)
2. Войдите через GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Выберите ваш репозиторий
5. Нажмите на проект → **Settings**
6. **Root Directory**: `backend`
7. **Variables** → добавьте:
   ```
   TELEGRAM_BOT_TOKEN=8203311307:AAGjMsjPyy3Dfaj11gSoRt_hd4J11cxTJoE
   PORT=3001
   ```
8. Дождитесь деплоя (2-3 минуты)
9. Скопируйте URL (например: `https://your-app.railway.app`)

---

## Шаг 3: Деплой Frontend на Vercel (3 минуты)

1. Откройте [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. **Add New Project**
4. Выберите ваш репозиторий
5. Настройки:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
6. **Environment Variables** → добавьте:
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```
   (замените на ваш URL от Railway)
7. **Deploy**
8. Скопируйте URL (например: `https://your-app.vercel.app`)

---

## Шаг 4: Подключите к Telegram (1 минута)

1. Откройте [@BotFather](https://t.me/botfather)
2. `/myapps` → выберите приложение
3. **Edit** → **Web App URL**
4. Вставьте URL от Vercel: `https://your-app.vercel.app`

---

## ✅ Готово!

Откройте бота в Telegram и нажмите "Open App" 🎉

---

## Что дальше?

- Приложение работает 24/7
- Каждый push в GitHub автоматически деплоится
- Бесплатно (до определенных лимитов)

## Проблемы?

- Проверьте логи в Railway/Vercel dashboard
- Убедитесь, что переменные окружения установлены
- Проверьте, что URL правильные

