module.exports = (sequelize, DataTypes) => {
  const Sektor = sequelize.define('Sektor', {
    nama_sektor: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'sektor',
    timestamps: false
  });

  Sektor.associate = (models) => {
    Sektor.hasMany(models.Perusahaan, { foreignKey: 'id_sektor' });
    Sektor.hasMany(models.User, { foreignKey: 'id_sektor' });
  };

  return Sektor;
};
