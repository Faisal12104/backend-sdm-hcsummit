// controllers/sektorController.js
const { Sektor } = require('../models');

exports.getAllSektor = async (req, res) => {
  try {
    const sektors = await Sektor.findAll({
      order: [['nama_sektor', 'ASC']] // urut berdasarkan nama sektor
    });
    res.json({ data: sektors });
  } catch (error) {
    console.error('Error fetching sektor:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data sektor' });
  }
};
