// controllers/berkasController.js
const { Berkas } = require('../models');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer: simpan file di memori
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Hanya file CSV yang diizinkan'));
    }
  }
});

// Middleware upload untuk route
exports.uploadMiddleware = upload.single('file');

exports.uploadBerkas = async (req, res) => {
  try {
    // Bersihkan body key dan value dari spasi/tab
    const cleanBody = {};
    Object.keys(req.body).forEach(key => {
      cleanBody[key.trim()] = typeof req.body[key] === 'string'
        ? req.body[key].trim()
        : req.body[key];
    });

    const { id_user, id_perusahaan, id_sektor, id_jabatan, id_tipe } = cleanBody;

    console.log('Body cleaned:', cleanBody);
    console.log('File:', req.file);

    if (!id_user || !id_perusahaan || !id_sektor) {
      return res.status(400).json({ error: 'id_user, id_perusahaan, dan id_sektor wajib diisi' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'File CSV wajib diunggah' });
    }

    const berkasBaru = await Berkas.create({
      id_user: parseInt(id_user, 10),
      id_perusahaan: parseInt(id_perusahaan, 10),
      id_sektor: parseInt(id_sektor, 10),
      nama_file: req.file.originalname,
      file_data: req.file.buffer,
      status: 'Waiting',
      tanggal_upload: new Date(),
      id_jabatan: id_jabatan ? parseInt(id_jabatan, 10) : null,
      id_tipe: id_tipe ? parseInt(id_tipe, 10) : null
    });

    res.status(201).json({
      message: 'Berkas CSV berhasil diunggah',
      data: berkasBaru
    });
  } catch (error) {
    console.error('Upload berkas error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat upload berkas', detail: error.message });
  }
};

// =============================
// GET - Lihat semua berkas sesuai sektor
// =============================
exports.adminSatkerHandlerGet = async (req, res) => {
  try {
    const { sektorId } = req.query; // ambil dari query ?sektorId=3
    if (!sektorId) {
      return res.status(400).json({ error: "sektorId wajib dikirim di query" });
    }

    // Gunakan id_sektor sesuai nama kolom di DB
    const berkas = await Berkas.findAll({
      where: { id_sektor: sektorId }
    });

    return res.json({ data: berkas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// =============================
// POST - Update status berkas
// =============================
exports.adminSatkerHandlerPost = async (req, res) => {
  try {
    const { berkasId, status } = req.body;
    if (!berkasId || !status) {
      return res.status(400).json({ error: "Masukkan berkasId dan status (Approved / Rejected)" });
    }

    // Set tanggal sesuai status
    const updateData = { status };
    if (status === "Approved") {
      updateData.tanggal_approved = new Date();
    } else if (status === "Rejected") {
      updateData.tanggal_rejected = new Date();
    }

    const berkas = await Berkas.findByPk(berkasId);
    if (!berkas) {
      return res.status(404).json({ error: "Berkas tidak ditemukan" });
    }

    await berkas.update(updateData);
    return res.json({ message: "Status berkas berhasil diupdate", data: berkas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
// =============================
// GET - Superadmin lihat semua berkas (tanpa filter sektor)
// =============================
exports.superadminGetAllBerkas = async (req, res) => {
  try {
    const berkas = await Berkas.findAll({
      order: [['tanggal_upload', 'DESC']] // terbaru di atas
    });

    return res.json({ data: berkas });
  } catch (error) {
    console.error('Superadmin get all berkas error:', error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
// =============================
// GET - Superadmin download berkas by id
// =============================
exports.superadminDownloadBerkas = async (req, res) => {
  try {
    const { id } = req.params;
    const berkas = await Berkas.findByPk(id);

    if (!berkas) {
      return res.status(404).json({ error: 'Berkas tidak ditemukan' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${berkas.nama_file}"`);
    res.setHeader('Content-Type', 'text/csv');
    return res.send(berkas.file_data);
  } catch (error) {
    console.error('Download berkas error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat download berkas' });
  }
};

// =============================
// PUT - Superadmin approve berkas by id
// =============================
exports.superadminApproveBerkas = async (req, res) => {
  try {
    const { id } = req.params;

    const berkas = await Berkas.findByPk(id);
    if (!berkas) {
      return res.status(404).json({ error: 'Berkas tidak ditemukan' });
    }

    await berkas.update({
      status: 'Approved',
      tanggal_approved: new Date()
    });

    res.json({ message: 'Berkas berhasil diapprove', data: berkas });
  } catch (error) {
    console.error('Approve berkas error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat approve berkas' });
  }
};

// =============================
// PUT - Superadmin reject berkas by id
// =============================
exports.superadminRejectBerkas = async (req, res) => {
  try {
    const { id } = req.params;

    const berkas = await Berkas.findByPk(id);
    if (!berkas) {
      return res.status(404).json({ error: 'Berkas tidak ditemukan' });
    }

    await berkas.update({
      status: 'Rejected',
      tanggal_rejected: new Date()
    });

    res.json({ message: 'Berkas berhasil direject', data: berkas });
  } catch (error) {
    console.error('Reject berkas error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat reject berkas' });
  }
};
