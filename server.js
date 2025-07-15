const jsonServer = require('json-server');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files từ thư mục dist (Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// Tạo JSON Server router
const router = jsonServer.router(path.join(__dirname, 'data/db.json'));
const middlewares = jsonServer.defaults({
  noCors: false
});

// Apply middlewares
app.use(middlewares);

// Mount JSON Server API trên /api
app.use('/api', router);

// Serve React app cho tất cả routes khác (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Frontend available at http://localhost:${PORT}`);
}); 