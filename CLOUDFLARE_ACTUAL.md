# ⚡ Актуальная настройка Cloudflare Pages

## Интерфейс Cloudflare Pages может отличаться

Если вы не видите указанных настроек, попробуйте следующие варианты:

---

## Вариант 1: Автоматическое определение

1. **Создайте проект:**
   - Pages → Create a project → Connect to Git
   - Выберите GitHub и ваш репозиторий

2. **Cloudflare может автоматически определить настройки:**
   - Если видите "Auto-detected settings" - проверьте их
   - Если неправильно - нажмите "Configure build"

3. **В настройках сборки найдите:**
   - **Build command** или **Build script**
   - **Output directory** или **Publish directory**
   - **Root directory** или **Working directory**

---

## Вариант 2: Ручная настройка после создания

1. **Создайте проект** (можно с любыми настройками)
2. После создания откройте проект
3. Перейдите в **Settings** → **Builds & deployments**
4. Там должны быть настройки:
   - **Build command**
   - **Build output directory**
   - **Root directory**

---

## Вариант 3: Создать файл конфигурации

Cloudflare Pages может использовать файл `wrangler.toml` или `_config.yml` в корне репозитория.

Создайте файл `wrangler.toml` в корне проекта:

```toml
name = "flux-planner"
compatibility_date = "2024-01-01"

[build]
command = "cd frontend && npm install && npm run build"
cwd = "frontend"
output = "dist"
```

Или создайте файл `.cloudflare/pages.toml`:

```toml
[build]
command = "cd frontend && npm install && npm run build"
output = "frontend/dist"
root = "frontend"
```

---

## Вариант 4: Использовать Cloudflare CLI (Wrangler)

Если веб-интерфейс не работает, можно использовать CLI:

```bash
# Установите Wrangler
npm install -g wrangler

# Войдите в Cloudflare
wrangler login

# Создайте проект
cd /Users/andreeviich/telegram-planner-app
wrangler pages project create flux-planner

# Настройте деплой
wrangler pages deploy frontend/dist --project-name=flux-planner
```

---

## Что нужно указать (если нашли настройки)

### Основные настройки:
- **Project name:** `flux-planner` (или любое другое)
- **Production branch:** `main` (или `master`)

### Настройки сборки (если доступны):
- **Build command:** `cd frontend && npm install && npm run build`
- **Build output directory:** `frontend/dist`
- **Root directory:** `frontend`

### Переменные окружения:
- `NODE_VERSION` = `18`
- `VITE_API_URL` = ваш backend URL

---

## Альтернатива: Использовать другой хостинг

Если Cloudflare Pages вызывает проблемы, можно использовать:

### GitHub Pages (проще)
- Уже есть инструкции в `GITHUB_PAGES_QUICK.md`
- Работает в России
- Простая настройка

### Vercel
- Может быть заблокирован в России
- Но интерфейс проще

---

## Что сделать сейчас

1. **Попробуйте Вариант 2** (Settings → Builds & deployments)
2. **Или создайте файл конфигурации** (Вариант 3)
3. **Или используйте GitHub Pages** (если Cloudflare не подходит)

Сообщите, что вы видите в интерфейсе Cloudflare - помогу настроить правильно!

