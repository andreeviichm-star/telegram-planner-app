# 🔧 Обновление workflow вручную

## Проблема

GitHub не позволяет обновлять workflow файлы без scope `workflow` в Personal Access Token.

## Решение: Обновите workflow через веб-интерфейс

### Вариант 1: Через GitHub веб-интерфейс (рекомендуется)

1. **Откройте файл в GitHub:**
   - https://github.com/andreeviichm-star/telegram-planner-app/blob/main/.github/workflows/deploy.yml

2. **Нажмите на карандаш (Edit) в правом верхнем углу**

3. **Замените содержимое на:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
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
          NODE_ENV: production
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_BASE_PATH: /telegram-planner-app/
      
      - name: Verify build output
        run: |
          echo "=== Build output contents ==="
          ls -la frontend/dist/ || echo "dist folder not found!"
          echo ""
          echo "=== Checking for index.html ==="
          if [ -f "frontend/dist/index.html" ]; then
            echo "✅ index.html found"
            echo "=== First 20 lines of index.html ==="
            head -20 frontend/dist/index.html
            echo ""
            echo "=== Checking for script tags ==="
            grep -i "script" frontend/dist/index.html || echo "No script tags found!"
            echo ""
            echo "=== Assets directory ==="
            ls -la frontend/dist/assets/ || echo "Assets directory not found!"
          else
            echo "❌ index.html NOT FOUND!"
            exit 1
          fi
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './frontend/dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

4. **Нажмите "Commit changes"**
5. **Введите commit message:** `Update workflow: add build verification`
6. **Нажмите "Commit changes"**

### Вариант 2: Обновить PAT (если хотите использовать git push)

1. **Создайте новый Personal Access Token:**
   - https://github.com/settings/tokens
   - Нажмите "Generate new token" → "Generate new token (classic)"
   - Название: `telegram-planner-app`
   - Срок действия: выберите нужный
   - Scopes: отметьте **`workflow`** (важно!)
   - Нажмите "Generate token"
   - Скопируйте токен

2. **Используйте токен для push:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/andreeviichm-star/telegram-planner-app.git
   git push
   ```

## Рекомендация:

**Используйте Вариант 1** - это проще и быстрее. Просто обновите файл через веб-интерфейс GitHub.

После обновления workflow автоматически запустится и задеплоит приложение с исправлениями!

