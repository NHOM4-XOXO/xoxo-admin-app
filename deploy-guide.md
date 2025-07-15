# 🚀 Quick Deploy Guide

## Setup lần đầu

### 1. Render Configuration
```bash
# Tạo 2 Web Services trên Render:

# STAGING
Name: xoxo-admin-app-staging
Branch: dev
Build: npm ci && npm run build  
Start: npm start

# PRODUCTION  
Name: xoxo-admin-app-production
Branch: main
Build: npm ci && npm run build
Start: npm start
```

### 2. Environment Variables (cho cả 2)
```
NODE_ENV=staging/production
PORT=3000
ENVIRONMENT=staging/production
```

## Quy trình hàng ngày

### 🧪 Deploy to Staging
```bash
git checkout dev
git add .
git commit -m "feat: new feature"
git push origin dev
# → Tự động deploy to staging
# → Test tại staging URL
```

### ✅ Deploy to Production  
```bash
git checkout main
git merge dev
git push origin main
# → Tự động deploy to production
```

## Troubleshooting

```bash
# Kiểm tra build logs
visit: Render Dashboard → Service → Logs

# Rollback nhanh (nếu production lỗi)
git checkout main
git reset --hard HEAD~1  # về commit trước
git push origin main --force

# Test local trước khi push
npm run build
npm start
```

## URLs sau khi setup
- **Staging:** https://xoxo-admin-staging.onrender.com
- **Production:** https://xoxo-admin-production.onrender.com
- **GitHub Actions:** https://github.com/yourrepo/actions 