# 🔧 Исправление: Workflow не запускается

## Проблема
В Actions видны только Jekyll workflows, а наш workflow "Deploy to GitHub Pages" не запускается.

## Причина
1. Workflow не создан на GitHub
2. Или workflow не запускается автоматически
3. Или есть конфликт с Jekyll workflows

---

## Решение

### Шаг 1: Удалите Jekyll workflows (если они есть)

1. Откройте репозиторий на GitHub
2. Перейдите в `.github/workflows/`
3. Если есть файлы `static.yml` или `jekyll-gh-pages.yml` - удалите их
4. Или отредактируйте их и удалите содержимое

### Шаг 2: Проверьте, есть ли наш workflow

1. Откройте `.github/workflows/deploy.yml` на GitHub
2. Если файла нет - создайте его (см. Шаг 3)
3. Если файл есть - проверьте его содержимое

### Шаг 3: Создайте/обновите workflow

1. Откройте `.github/workflows/deploy.yml` на GitHub
2. Нажмите на карандаш (Edit)
3. Убедитесь, что содержимое такое:

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
          VITE_BASE_PATH: /telegram-planner-app/
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
          cname: false
```

4. Сохраните (Commit changes)

### Шаг 4: Запустите workflow вручную

1. Репозиторий → **Actions**
2. В левом меню найдите **"Deploy to GitHub Pages"**
3. Если его нет - обновите страницу
4. Нажмите на workflow
5. Нажмите **"Run workflow"** (справа вверху)
6. Выберите ветку: **main**
7. Нажмите **"Run workflow"**

### Шаг 5: Дождитесь завершения

1. В **Actions** дождитесь завершения workflow
2. Должен быть зеленый статус ✅
3. После этого сайт должен обновиться

---

## Альтернатива: Загрузить через git

Если не хотите редактировать через веб-интерфейс:

```bash
cd /Users/andreeviich/telegram-planner-app

# Синхронизируйте с GitHub
git pull --rebase

# Добавьте workflow файл
git add .github/workflows/deploy.yml

# Создайте коммит
git commit -m "Add GitHub Pages deployment workflow"

# Загрузите на GitHub
git push
```

После push workflow должен автоматически запуститься.

---

## Проверка

После выполнения шагов:

1. ✅ Workflow "Deploy to GitHub Pages" появился в Actions
2. ✅ Workflow успешно выполнился
3. ✅ GitHub Pages показывает приложение, а не README

---

## Если все еще не работает

Проверьте:
1. Правильно ли настроен GitHub Pages (Source = "GitHub Actions")
2. Есть ли секрет `VITE_API_URL` в Settings → Secrets
3. Правильно ли указан путь в workflow (`paths: - 'frontend/**'`)

Сообщите, что видите в Actions после выполнения шагов!

