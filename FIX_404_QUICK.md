# ⚡ Быстрое исправление ошибки 404

## Проблема
```
Failed to load resource: the server responded with a status of 404
```

## Причина
Неправильный base path для GitHub Pages.

---

## Решение

### Вариант 1: Обновить workflow (рекомендуется)

В файле `.github/workflows/deploy.yml` обновите секцию Build:

```yaml
- name: Build
  run: |
    cd frontend
    npm run build
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
    VITE_BASE_PATH: /telegram-planner-app/  # Добавьте эту строку
```

**Если ваш URL:** `https://username.github.io/telegram-planner-app/`
→ Используйте: `VITE_BASE_PATH: /telegram-planner-app/`

**Если ваш URL:** `https://username.github.io/`
→ Используйте: `VITE_BASE_PATH: /`

---

### Вариант 2: Временно изменить vite.config.ts

Если workflow еще не создан, можно временно изменить `frontend/vite.config.ts`:

```typescript
base: '/telegram-planner-app/',  // Или '/' если корневой домен
```

Затем загрузите изменения и пересоберите.

---

## Проверка URL

1. Откройте ваш репозиторий на GitHub
2. Settings → Pages
3. Посмотрите URL:
   - Если `https://username.github.io/telegram-planner-app/` → base path: `/telegram-planner-app/`
   - Если `https://username.github.io/` → base path: `/`

---

## После исправления

1. **Обновите workflow** (если используете GitHub Actions)
2. **Или загрузите изменения** в `vite.config.ts`
3. **Пересоберите проект**
4. **Проверьте работу сайта**

---

## Если все еще не работает

1. **Очистите кэш браузера** (Ctrl+Shift+R)
2. **Проверьте консоль** (F12) - какие именно ресурсы не загружаются?
3. **Проверьте настройки GitHub Pages** - правильно ли выбран source?

Сообщите, какой URL у вас - помогу настроить правильно!

