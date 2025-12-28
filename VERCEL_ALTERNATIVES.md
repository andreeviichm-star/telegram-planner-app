# 🔧 Альтернативы Vercel - Решение проблем с MIME type

## Проблема: Vercel не работает из-за MIME type ошибки

Если Vercel все еще не работает из-за проблемы с MIME type, попробуйте альтернативные хостинги.

---

## Решение 1: Netlify (рекомендуется для Vite)

Netlify лучше работает с Vite и обычно не имеет проблем с MIME type.

### Шаг 1: Зарегистрируйтесь на Netlify

1. Откройте [netlify.com](https://netlify.com)
2. Войдите через GitHub

### Шаг 2: Деплой проекта

1. **Add new site** → **Import an existing project**
2. Выберите **GitHub** → выберите ваш репозиторий
3. Настройки:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **Environment variables**:
   - `VITE_API_URL` = `https://your-backend-url.railway.app/api`
5. **Deploy site**

### Шаг 3: Получите URL

После деплоя получите URL (например: `https://your-app.netlify.app`)

### Шаг 4: Подключите к Telegram

1. BotFather → `/myapps` → ваше приложение → Edit → Web App URL
2. Вставьте URL от Netlify

---

## Решение 2: Cloudflare Pages

Cloudflare Pages бесплатный и быстрый.

### Шаг 1: Зарегистрируйтесь

1. Откройте [pages.cloudflare.com](https://pages.cloudflare.com)
2. Войдите через GitHub

### Шаг 2: Деплой

1. **Create a project** → **Connect to Git**
2. Выберите репозиторий
3. Настройки:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`
4. **Environment variables**:
   - `VITE_API_URL` = `https://your-backend-url.railway.app/api`
5. **Save and Deploy**

### Шаг 3: Подключите к Telegram

1. Получите URL (например: `https://your-app.pages.dev`)
2. Обновите в BotFather

---

## Решение 3: Исправить Vercel через другой подход

Если хотите остаться на Vercel, попробуйте:

### Вариант A: Использовать другой формат сборки

Измените `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js'
      }
    }
  }
})
```

### Вариант B: Создать новый проект в Vercel

1. Удалите текущий проект (Settings → Danger Zone → Delete)
2. Создайте новый проект из того же репозитория
3. При создании:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Добавьте переменную `VITE_API_URL`
5. Деплойте

---

## Решение 4: Использовать GitHub Pages (простой вариант)

### Шаг 1: Настройте GitHub Actions

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

### Шаг 2: Включите GitHub Pages

1. GitHub репозиторий → Settings → Pages
2. Source: GitHub Actions
3. Сохраните

### Шаг 3: Получите URL

URL будет: `https://your-username.github.io/telegram-planner-app/`

---

## Рекомендация

**Для быстрого решения используйте Netlify** - он лучше всего работает с Vite и обычно не имеет проблем с MIME type.

**Для постоянного решения** - Cloudflare Pages (быстрый и бесплатный) или исправленный Vercel.

---

## Проверка после деплоя

После деплоя на любой платформе:

1. Откройте URL в браузере
2. F12 → Console
3. Проверьте, нет ли ошибок MIME type
4. Если все работает - обновите URL в BotFather

---

## Если ничего не помогает

Попробуйте использовать HashRouter (уже сделано) и убедитесь, что:
1. Все файлы загружены на GitHub
2. Переменные окружения настроены
3. Build проходит успешно

