module.exports = (sequelize, DataTypes) => {
  const Berkas = sequelize.define('Berkas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_perusahaan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_sektor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_file: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_data: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Approved', 'Rejected', 'Waiting'),
      allowNull: false
    },
    tanggal_upload: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_jabatan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_tipe: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'berkas',
    timestamps: false
  });

  return Berkas;
};
