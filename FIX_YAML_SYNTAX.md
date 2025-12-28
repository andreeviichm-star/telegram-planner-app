# 🔧 Исправление ошибки YAML синтаксиса

## Проблема
```
Invalid workflow file: .github/workflows/deploy.yml#L11
You have an error in your yaml syntax on line 11
```

## Решение

### Обновите файл на GitHub

1. Откройте `.github/workflows/deploy.yml` на GitHub
2. Нажмите на карандаш (✏️) для редактирования
3. **Удалите все содержимое** файла
4. **Вставьте это содержимое** (скопируйте полностью):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pages: write
      id-token: write
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
            head -5 frontend/dist/index.html
          else
            echo "❌ index.html NOT FOUND!"
            exit 1
          fi
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
          destination_dir: ./
          cname: false
          force_orphan: true
          keep_files: false
```

5. **Важно:** Убедитесь, что отступы правильные (используйте пробелы, не табы)
6. Сохраните (Commit changes)

---

## Проверка

После сохранения:
1. GitHub должен проверить синтаксис
2. Если ошибок нет - файл будет сохранен
3. Если есть ошибки - GitHub покажет, где проблема

---

## Если все еще есть ошибки

1. Проверьте, что все отступы сделаны **пробелами** (не табами)
2. Убедитесь, что нет лишних пробелов в начале строк
3. Проверьте, что все кавычки закрыты

---

## Готово!

После исправления workflow должен работать без ошибок синтаксиса.

