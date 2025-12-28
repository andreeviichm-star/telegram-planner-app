# ⚡ Быстрая настройка GitHub Pages

## Проблема решена
Я удалил файл workflow из коммита. Теперь нужно создать его вручную через веб-интерфейс GitHub.

---

## Шаг 1: Загрузите изменения

```bash
cd /Users/andreeviich/telegram-planner-app

git add .
git commit -m "Fix Telegram WebApp and add redirects"
git push
```

---

## Шаг 2: Создайте workflow через GitHub

1. **Откройте ваш репозиторий на GitHub:**
   - `https://github.com/andreeviichm-star/telegram-planner-app`

2. **Создайте папку и файл:**
   - Нажмите **Add file** → **Create new file**
   - В поле пути введите: `.github/workflows/deploy.yml`
   - GitHub автоматически создаст папку `.github/workflows/`

3. **Вставьте содержимое:**

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
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
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
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
          cname: false
```

4. **Нажмите "Commit new file"** внизу страницы

---

## Шаг 3: Добавьте секрет

1. Ваш репозиторий → **Settings** (вверху справа)
2. В левом меню: **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. **Name:** `VITE_API_URL`
5. **Secret:** ваш backend URL (например: `https://your-backend.railway.app/api`)
6. Нажмите **Add secret**

---

## Шаг 4: Включите GitHub Pages

1. Ваш репозиторий → **Settings**
2. В левом меню: **Pages**
3. **Source:** выберите **GitHub Actions** (не "Deploy from a branch"!)
4. Сохраните

---

## Шаг 5: Проверьте деплой

1. Ваш репозиторий → **Actions** (вверху)
2. Дождитесь завершения деплоя (2-3 минуты)
3. После успешного деплоя URL будет:
   - `https://andreeviichm-star.github.io/telegram-planner-app/`

---

## Шаг 6: Обновите URL в BotFather

1. Скопируйте URL от GitHub Pages
2. Откройте [@BotFather](https://t.me/botfather)
3. Отправьте `/myapps`
4. Выберите ваше приложение
5. Выберите **Edit Web App URL**
6. Вставьте новый URL: `https://andreeviichm-star.github.io/telegram-planner-app/`
7. Готово!

---

## Готово! 🎉

После этого приложение будет автоматически деплоиться на GitHub Pages при каждом изменении в папке `frontend/`.

---

## Если что-то не работает

1. **Проверьте Actions:**
   - Репозиторий → Actions
   - Посмотрите логи деплоя

2. **Проверьте секреты:**
   - Settings → Secrets → Actions
   - Убедитесь, что `VITE_API_URL` добавлен

3. **Проверьте Pages:**
   - Settings → Pages
   - Убедитесь, что Source = "GitHub Actions"

Сообщите, если нужна помощь!

