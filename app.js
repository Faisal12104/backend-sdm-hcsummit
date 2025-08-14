require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const berkasRoutes = require('./routes/berkasRoutes');
const sektorRouter = require('./routes/sektorRoutes');
const { sequelize } = require('./config/db'); // ✅ perbaikan di sini
const User = require('./models/user')(sequelize, require('sequelize').DataTypes);

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synchronized');
}).catch((err) => {
  console.error('❌ Database sync failed:', err);
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/berkas', berkasRoutes);
app.use('/api/sektor', sektorRouter);
// Test root
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
