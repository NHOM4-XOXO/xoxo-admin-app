# ========== Base deps layer ==========
FROM node:18-alpine AS deps
WORKDIR /app

# Copy lock files để cache tốt hơn
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# ========== Builder layer ==========
FROM node:18-alpine AS builder
WORKDIR /app

# Copy toàn bộ deps (bao gồm devDeps) để build
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build Vite ReactJS
RUN npm run build

# ========== Runner (production) ==========
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Tạo user non-root để bảo mật
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactjs -u 1001

# Chỉ copy dist và node_modules cần thiết để chạy serve
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist

# Cài serve để chạy dist
RUN npm install -g serve

USER reactjs

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
