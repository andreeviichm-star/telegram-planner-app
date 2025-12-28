# 🔧 Исправление API URL и CORS

## Проблема

1. **API URL содержит placeholder**: `https://your-app-name.railway.app`
2. **CORS ошибка**: запросы блокируются из-за неправильного URL

## Решение

### 1. Обновите секрет VITE_API_URL в GitHub

1. Откройте: https://github.com/andreeviichm-star/telegram-planner-app/settings/secrets/actions
2. Найдите секрет `VITE_API_URL`
3. Если там `https://your-app-name.railway.app` или другой placeholder:
   - Нажмите "Update" (или удалите и создайте заново)
   - Введите ваш **реальный** Railway URL
   - URL должен заканчиваться на `/api`
   - Пример: `https://your-real-app-name.railway.app/api`

### 2. Проверьте ваш Railway URL

1. Откройте Railway: https://railway.app
2. Выберите ваш проект
3. Откройте вкладку "Settings"
4. Найдите "Public Domain" или "Custom Domain"
5. Скопируйте URL (например: `https://your-app-name.railway.app`)
6. Добавьте `/api` в конец: `https://your-app-name.railway.app/api`

### 3. После обновления секрета

1. Перезапустите workflow:
   - Откройте: https://github.com/andreeviichm-star/telegram-planner-app/actions
   - Найдите последний workflow run
   - Нажмите "Re-run jobs" → "Re-run all jobs"

2. Или сделайте новый commit:
   ```bash
   cd /Users/andreeviich/telegram-planner-app
   git commit --allow-empty -m "Trigger rebuild with new API URL"
   git push
   ```

### 4. Проверьте CORS на бэкенде

Бэкенд уже настроен правильно (`origin: '*'`), но убедитесь, что:
- Backend запущен на Railway
- URL правильный (не placeholder)
- Backend доступен по URL (проверьте в браузере: `https://your-app-name.railway.app/health`)

## Важно!

- ✅ URL должен заканчиваться на `/api`
- ✅ URL должен быть реальным (не placeholder)
- ✅ После обновления секрета нужно перезапустить workflow

