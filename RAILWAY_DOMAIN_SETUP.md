# 🌐 Настройка публичного домена в Railway

## Шаг 1: Генерация домена

1. В Railway найдите раздел **"Public Networking"**
2. Нажмите кнопку **"Generate Domain"**
3. Railway автоматически создаст публичный URL, например:
   - `https://your-app-name-production.up.railway.app`
   - или `https://your-app-name.railway.app`

## Шаг 2: Скопируйте URL

После генерации вы увидите что-то вроде:
```
https://your-app-name-production.up.railway.app
```

**Скопируйте этот URL!**

## Шаг 3: Добавьте `/api` в конец

Ваш API URL должен быть:
```
https://your-app-name-production.up.railway.app/api
```

## Шаг 4: Обновите секрет в GitHub

1. Откройте: https://github.com/andreeviichm-star/telegram-planner-app/settings/secrets/actions
2. Найдите секрет `VITE_API_URL`
3. Нажмите "Update"
4. Вставьте ваш URL с `/api` в конце:
   ```
   https://your-app-name-production.up.railway.app/api
   ```
5. Сохраните

## Шаг 5: Проверьте, что бэкенд работает

Откройте в браузере:
```
https://your-app-name-production.up.railway.app/health
```

Должен вернуться JSON:
```json
{"status":"ok"}
```

## Шаг 6: Перезапустите GitHub Pages workflow

После обновления секрета:
1. Откройте: https://github.com/andreeviichm-star/telegram-planner-app/actions
2. Найдите последний workflow
3. Нажмите "Re-run jobs" → "Re-run all jobs"

Или сделайте пустой commit:
```bash
git commit --allow-empty -m "Trigger rebuild with Railway domain"
git push
```

## Важно!

- ✅ URL должен заканчиваться на `/api`
- ✅ Используйте URL от Railway (не localhost)
- ✅ После обновления секрета перезапустите workflow

