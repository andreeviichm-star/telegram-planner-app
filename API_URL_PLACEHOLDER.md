# ⚠️ Проблема с API URL

## Обнаружена проблема

В логах видно:
```
API URL: https://your-backend.railway.app/api
```

Это **плейсхолдер**, а не реальный URL! Нужно установить правильный URL backend.

---

## Решение

### 1. Проверьте секрет VITE_API_URL в GitHub

1. GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Найдите секрет `VITE_API_URL`
3. Проверьте значение:
   - ❌ НЕ должно быть: `https://your-backend.railway.app/api`
   - ✅ Должно быть: ваш реальный URL backend (например: `https://your-app.railway.app/api`)

### 2. Если секрет неправильный

1. GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Найдите `VITE_API_URL`
3. Нажмите **"Update"**
4. Введите правильный URL вашего backend
5. URL должен заканчиваться на `/api` (например: `https://your-app.railway.app/api`)
6. Сохраните

### 3. Перезапустите workflow

После исправления секрета:

1. **Actions** → **Deploy to GitHub Pages**
2. Нажмите **"Run workflow"**
3. Дождитесь завершения (2-3 минуты)
4. Проверьте сайт снова

---

## Что проверить

1. ✅ **Секрет `VITE_API_URL` правильный?** (не плейсхолдер)
2. ✅ **URL заканчивается на `/api`?** (например: `https://your-app.railway.app/api`)
3. ✅ **Workflow перезапущен?** (после исправления секрета)

---

## После исправления

В логах должно быть:
```
API URL: https://your-real-backend.railway.app/api
```

А не:
```
API URL: https://your-backend.railway.app/api
```

Исправьте секрет и перезапустите workflow!

