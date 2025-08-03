module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    nama_role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    deskripsi: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'roles',
    timestamps: true
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'id_role' });
  };

  return Role;
};
