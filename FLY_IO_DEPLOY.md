# 🚀 Деплой на Fly.io (бесплатно)

## Почему Fly.io?

- ✅ Бесплатный tier (3 shared-cpu-1x VMs)
- ✅ Быстрый
- ✅ Работает в России
- ✅ Нет "сна" сервисов

## Шаг 1: Установите Fly CLI

```bash
# macOS
curl -L https://fly.io/install.sh | sh

# Или через Homebrew
brew install flyctl
```

## Шаг 2: Войдите в Fly.io

```bash
fly auth login
```

Откроется браузер для авторизации.

## Шаг 3: Инициализируйте проект

```bash
cd /Users/andreeviich/telegram-planner-app/backend
fly launch
```

Fly спросит:
- App name: `telegram-planner-backend` (или любое имя)
- Region: выберите ближайший
- PostgreSQL: No (используем SQLite)
- Redis: No

## Шаг 4: Настройте fly.toml

Fly создаст файл `fly.toml`. Убедитесь, что там:

```toml
[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 0
```

## Шаг 5: Обновите server.js

Убедитесь, что сервер использует PORT из переменных окружения:

```javascript
const PORT = process.env.PORT || 3001
```

## Шаг 6: Деплой

```bash
fly deploy
```

## Шаг 7: Получите URL

```bash
fly status
```

Или в Dashboard: https://fly.io/dashboard

URL будет вида: `https://telegram-planner-backend.fly.dev`

## Шаг 8: Проверьте health endpoint

```
https://telegram-planner-backend.fly.dev/health
```

## Шаг 9: Обновите секрет VITE_API_URL

```
https://telegram-planner-backend.fly.dev/api
```

## Преимущества Fly.io:

- ✅ Нет "сна" сервисов
- ✅ Быстрый старт
- ✅ Хорошая документация

## Недостатки:

- ⚠️ Нужно использовать CLI
- ⚠️ Может быть сложнее для новичков

