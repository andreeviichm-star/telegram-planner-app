# 📝 Ручная настройка GitHub Pages

## Проблема
GitHub не позволяет загружать workflow файлы без токена с правами `workflow`.

## Решение: Создать workflow вручную

### Шаг 1: Загрузите остальные изменения

```bash
cd /Users/andreeviich/telegram-planner-app

git add .
git commit -m "Fix Telegram WebApp and add redirects"
git push
```

### Шаг 2: Создайте workflow через веб-интерфейс

1. Откройте ваш репозиторий на GitHub
2. Нажмите **Add file** → **Create new file**
3. Путь: `.github/workflows/deploy.yml`
4. Вставьте содержимое:

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

5. Нажмите **Commit new file**

### Шаг 3: Добавьте секрет

1. Ваш репозиторий → **Settings** → **Secrets and variables** → **Actions**
2. Нажмите **New repository secret**
3. Name: `VITE_API_URL`
4. Value: ваш backend URL (например: `https://your-backend.railway.app/api`)
5. Нажмите **Add secret**

### Шаг 4: Включите GitHub Pages

1. Ваш репозиторий → **Settings** → **Pages**
2. **Source**: выберите **GitHub Actions**
3. Сохраните

### Шаг 5: Проверьте деплой

1. Ваш репозиторий → **Actions**
2. Дождитесь завершения деплоя (2-3 минуты)
3. После деплоя URL будет: `https://andreeviichm-star.github.io/telegram-planner-app/`

### Шаг 6: Обновите URL в BotFather

1. Скопируйте URL от GitHub Pages
2. Откройте [@BotFather](https://t.me/botfather)
3. Отправьте `/myapps`
4. Выберите ваше приложение
5. Обновите **Web App URL**

---

## Альтернатива: Обновить токен

Если хотите загружать workflow файлы через git:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Создайте новый токен или отредактируйте существующий
3. Добавьте галочку **workflow**
4. Сохраните токен
5. Используйте новый токен для git push

Но проще создать workflow через веб-интерфейс (Шаг 2 выше).

---

## Готово! 🎉

После выполнения всех шагов приложение будет автоматически деплоиться на GitHub Pages при каждом изменении в папке `frontend/`.

