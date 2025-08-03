module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    no_telp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_perusahaan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_jabatan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_sektor: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true, // createdAt dan updatedAt otomatis
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'id_role', as: 'role' });
    User.belongsTo(models.Perusahaan, { foreignKey: 'id_perusahaan', as: 'perusahaan' });
    User.belongsTo(models.Jabatan, { foreignKey: 'id_jabatan', as: 'jabatan' });
    User.belongsTo(models.Sektor, { foreignKey: 'id_sektor', as: 'sektor' });

    User.hasOne(models.Eksternal, { foreignKey: 'user_id' });
  };

  return User;
};
