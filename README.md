# XOXO Admin App

Ứng dụng quản trị cho hệ thống XOXO Social Media.

## 🚀 Deployment với Render

### Cấu trúc dự án
```
xoxo-admin-app/
├── data/
│   └── db.json          # Database JSON Server
├── src/                 # Source code React
├── server.js           # Production server
├── render.yaml         # Cấu hình Render
└── .github/workflows/  # GitHub Actions
```

### Quy trình Deployment (Staging → Production)

#### 🔄 **Branching Strategy**
```
feature/xyz → dev → staging → main
     ↓         ↓       ↓        ↓
   Local    Staging  Testing  Production
```

#### 1. **GitHub Actions** (Tự động)
- **Pull Request → dev/main:** Chạy tests + build validation
- **Push → dev/staging:** Deploy to staging environment  
- **Push → main:** Deploy to production environment

#### 2. **Render Setup** (2 environments)

##### **STAGING Environment**
```yaml
Name: xoxo-admin-app-staging
Branch: dev
URL: https://xoxo-admin-staging.onrender.com
Environment: staging
```

##### **PRODUCTION Environment**  
```yaml
Name: xoxo-admin-app-production
Branch: main  
URL: https://xoxo-admin-prod.onrender.com
Environment: production
```

#### 3. **Deployment Steps**

**Bước 1:** Test trên staging
```bash
git checkout dev
git push origin dev  # → Deploy to staging
```

**Bước 2:** Verify staging app
- Kiểm tra functionality
- Test API endpoints
- Validate UI/UX

**Bước 3:** Deploy to production
```bash
git checkout main
git merge dev
git push origin main  # → Deploy to production
```

### Các script chính

```bash
# Development
npm run dev              # Chạy frontend only
npm run dev:full         # Chạy cả frontend và JSON server
npm run json-server      # Chạy JSON server only

# Production
npm run build           # Build for production
npm start              # Start production server
```

### Production Server
File `server.js` serve cả:
- React app tại `/`
- JSON Server API tại `/api/*`

### API Endpoints
```
GET  /api/users         # Quản lý users
GET  /api/posts         # Quản lý posts  
GET  /api/reports       # Quản lý reports
GET  /api/stats         # Dashboard stats
```

## 📦 Giải pháp thay thế

### 1. **Monorepo approach**
- Deploy cả thư mục cha chứa json-server-data
- Cập nhật build commands

### 2. **Sử dụng Database thật**
- PostgreSQL, MongoDB, MySQL
- Migrate data từ JSON sang DB
- Tăng hiệu suất và bảo mật

### 3. **Separate API deployment**
- Deploy JSON Server riêng
- Update API endpoints trong frontend
- Tách biệt concerns

## 🔧 Troubleshooting

**Lỗi common:**
1. **File db.json không tìm thấy**: Đảm bảo file ở `data/db.json`
2. **API không hoạt động**: Kiểm tra proxy config trong `vite.config.ts`
3. **Deploy fail**: Kiểm tra logs trên Render Dashboard 