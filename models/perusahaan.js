module.exports = (sequelize, DataTypes) => {
  const Perusahaan = sequelize.define('Perusahaan', {
    nama_perusahaan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status_approval: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'perusahaan',
    timestamps: false
  });

  Perusahaan.associate = (models) => {
    Perusahaan.belongsTo(models.Sektor, { foreignKey: 'id_sektor' });
    Perusahaan.hasMany(models.User, { foreignKey: 'id_perusahaan' });
    Perusahaan.hasMany(models.Jabatan, { foreignKey: 'id_perusahaan' });
  };

  return Perusahaan;
};
