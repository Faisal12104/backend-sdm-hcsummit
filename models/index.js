const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Role = require('./role')(sequelize, DataTypes);
db.Eksternal = require('./eksternal')(sequelize, DataTypes);
db.Perusahaan = require('./perusahaan')(sequelize, DataTypes);
db.Sektor = require('./sektor')(sequelize, DataTypes);
db.Jabatan = require('./jabatan')(sequelize, DataTypes);

// Relasi
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
