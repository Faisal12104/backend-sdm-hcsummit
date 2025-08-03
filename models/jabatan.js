module.exports = (sequelize, DataTypes) => {
  const Jabatan = sequelize.define('Jabatan', {
    nama_jabatan: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'jabatan',
    timestamps: false
  });

  Jabatan.associate = (models) => {
    Jabatan.belongsTo(models.Perusahaan, { foreignKey: 'id_perusahaan' });
    Jabatan.hasMany(models.User, { foreignKey: 'id_jabatan' });
  };

  return Jabatan;
};
