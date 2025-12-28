# 🔧 Исправление ошибки Cloudflare Pages

## Проблема
```
Failed: error occurred while running deploy command
```

## Решение

### Вариант 1: Правильные настройки в Cloudflare Dashboard

В настройках проекта Cloudflare Pages:

1. **Build settings:**
   - **Framework preset:** `None` (не Vite!)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `frontend`

2. **Environment variables:**
   - `NODE_VERSION` = `18`
   - `VITE_API_URL` = ваш backend URL

3. **Save and Deploy**

---

### Вариант 2: Если не работает - используйте GitHub Actions

Cloudflare Pages может иметь проблемы с автоматической сборкой. Используйте GitHub Actions:

#### Шаг 1: Создайте GitHub Action

Создайте файл `.github/workflows/cloudflare-pages.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: flux-planner
          directory: frontend/dist
```

#### Шаг 2: Получите токены Cloudflare

1. Зайдите на [dash.cloudflare.com](https://dash.cloudflare.com)
2. My Profile → API Tokens
3. Create Token → Edit Cloudflare Workers
4. Скопируйте токен

#### Шаг 3: Добавьте секреты в GitHub

1. Ваш репозиторий → Settings → Secrets and variables → Actions
2. Добавьте:
   - `CLOUDFLARE_API_TOKEN` = ваш токен
   - `CLOUDFLARE_ACCOUNT_ID` = ваш Account ID (найдите в правом верхнем углу Cloudflare)
   - `VITE_API_URL` = ваш backend URL

#### Шаг 4: Создайте проект в Cloudflare

1. Cloudflare Pages → Create a project
2. Выберите **Direct Upload** (не Git!)
3. Назовите проект: `flux-planner`
4. Не загружайте файлы - GitHub Actions сделает это автоматически

---

### Вариант 3: Используйте другой хостинг

Если Cloudflare не работает, попробуйте:

#### GitHub Pages (проще всего)

1. **Обновите `vite.config.ts`:**
```typescript
export default defineConfig({
  base: '/telegram-planner-app/', // или имя вашего репозитория
  // ... остальное
})
```

2. **Создайте GitHub Action:**
Создайте `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install and build
        run: |
          cd frontend
          npm ci
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

3. **Включите GitHub Pages:**
   - Settings → Pages
   - Source: GitHub Actions

4. **Добавьте секрет:**
   - Settings → Secrets → Actions
   - `VITE_API_URL` = ваш backend URL

---

## Рекомендация

**Попробуйте сначала Вариант 1** (изменить настройки в Cloudflare Dashboard).

Если не работает - используйте **GitHub Pages** (Вариант 3) - это проще и надежнее.

---

## Быстрая проверка

1. Убедитесь, что код загружен на GitHub
2. Попробуйте изменить настройки в Cloudflare Dashboard
3. Если не работает - используйте GitHub Pages

Сообщите, какой вариант выберете!

