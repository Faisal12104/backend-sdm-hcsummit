module.exports = (sequelize, DataTypes) => {
  const Eksternal = sequelize.define('Eksternal', {
    status_registrasi: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    tanggal_approval: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'eksternal',
    timestamps: false
  });

  Eksternal.associate = (models) => {
    Eksternal.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Eksternal;
};
