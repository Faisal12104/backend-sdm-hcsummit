const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const { User, Role, Jabatan, Perusahaan, Sektor, Eksternal } = require('../models');

// 🚨 Validasi model sebelum lanjut
if (!User || !Role || !Jabatan || !Perusahaan || !Sektor || !Eksternal) {
  throw new Error('Salah satu model tidak ditemukan. Cek file models/index.js dan pastikan semua model sudah di-export.');
}

// ========================================
// ✅ REGISTRASI USER EKSTERNAL
// ========================================
exports.register = async (req, res) => {
  try {
    const {
      nama_lengkap,
      username,
      email,
      no_telp,
      password,
      nama_perusahaan,
      nama_sektor,
      nama_jabatan
    } = req.body;

    // Cek user sudah ada
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ username }, { email }]
      }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Username atau email sudah digunakan' });
    }

    // Buat sektor, perusahaan, jabatan
    const [sektor] = await Sektor.findOrCreate({ where: { nama_sektor } });
    const [perusahaan] = await Perusahaan.findOrCreate({
      where: { nama_perusahaan },
      defaults: {
        id_sektor: sektor.id,
        status_approval: false
      }
    });
    const [jabatan] = await Jabatan.findOrCreate({
      where: { nama_jabatan },
      defaults: {
        id_perusahaan: perusahaan.id
      }
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user eksternal
    const user = await User.create({
      nama_lengkap,
      username,
      email,
      no_telp,
      password: hashedPassword,
      id_perusahaan: perusahaan.id,
      id_sektor: sektor.id,
      id_jabatan: jabatan.id,
      id_role: 3,
      is_approved: false
    });

    // Buat record eksternal
    await Eksternal.create({
      user_id: user.id,
      status_registrasi: 'Pending'
    });

    res.status(201).json({
      message: 'Registrasi berhasil, menunggu approval',
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat registrasi' });
  }
};

// ========================================
// ✅ MANAJEMEN USER SUPERADMIN
// ========================================
exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
      return res.status(400).json({ error: 'Username atau Email dan Password wajib diisi' });
    }

    const user = await User.findOne({
      where: username ? { username } : { email },
      include: [
        { model: Role, as: 'role' },
        { model: Jabatan, as: 'jabatan' },
        { model: Perusahaan, as: 'perusahaan' },
        { model: Sektor, as: 'sektor' }
      ]
    });

    if (!user) return res.status(401).json({ error: 'User tidak ditemukan' });
    if (user.id_role === 3 && !user.is_approved) {
      return res.status(403).json({ error: 'Akun Anda belum disetujui' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Password salah' });

    res.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        username: user.username,
        email: user.email,
        role: user.role?.nama_role || 'Tidak diketahui',
        jabatan: user.jabatan?.nama_jabatan || 'Tidak diketahui',
        perusahaan: user.perusahaan?.nama_perusahaan || 'Tidak diketahui',
        sektor: user.sektor?.nama_sektor || 'Tidak diketahui'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat login' });
  }
};

// controllers/authController.js
exports.manageEksternal = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const eksternals = await Eksternal.findAll({
        include: [
          {
            model: User,
            as: 'user',
            include: [
              { model: Role, as: 'role' },
              { model: Jabatan, as: 'jabatan' },
              { model: Perusahaan, as: 'perusahaan' },
              { model: Sektor, as: 'sektor' }
            ]
          }
        ]
      });

      return res.json({
        message: 'Daftar user eksternal',
        data: eksternals
      });
    }

    if (req.method === 'POST') {
      const { eksternalUserId, status } = req.body;

      if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status harus Approved atau Rejected' });
      }

      const eksternalData = await Eksternal.findOne({
        where: { user_id: eksternalUserId },
        include: [{ model: User, as: 'user' }]
      });

      if (!eksternalData) {
        return res.status(404).json({ error: 'Data eksternal tidak ditemukan' });
      }

      await eksternalData.update({
        status_registrasi: status,
        tanggal_approval: new Date()
      });

      await eksternalData.user.update({
        is_approved: status === 'Approved'
      });

      return res.json({ message: `User eksternal berhasil ${status.toLowerCase()}` });
    }

    return res.status(405).json({ error: 'Method tidak diizinkan' });
  } catch (error) {
    console.error('Manage eksternal error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat proses manage eksternal' });
  }
};
// ========================================
// ✅ MANAJEMEN USER EKSTERNAL - ADMIN SATUAN KERJA
// ========================================
exports.manageEksternalAdminSatker = async (req, res) => {
  try {
    // Ambil sektorId dari body atau query (karena tanpa JWT)
    const sektorIdAdmin = req.query?.sektorId || req.body?.sektorId;

    if (!sektorIdAdmin) {
      return res.status(400).json({ error: 'sektorId wajib dikirim di query atau body' });
    }

    if (req.method === 'GET') {
      const eksternalUsers = await User.findAll({
        where: {
          id_sektor: sektorIdAdmin,
          id_role: 3,
        },
        include: [
          { model: Role, as: 'role', attributes: ['nama_role'] },
          { model: Jabatan, as: 'jabatan', attributes: ['nama_jabatan'] },
          { model: Perusahaan, as: 'perusahaan', attributes: ['nama_perusahaan'] },
          { model: Sektor, as: 'sektor', attributes: ['nama_sektor'] },
          { model: Eksternal, as: 'eksternal', attributes: ['status_registrasi', 'tanggal_approval'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        message: `Daftar user eksternal sektor ${sektorIdAdmin}`,
        data: eksternalUsers
      });
    }

    if (req.method === 'POST') {
      const { userId, action } = req.body;

      if (!userId || !['Approved', 'Rejected'].includes(action)) {
        return res.status(400).json({ error: 'Masukkan userId dan action (Approved / Rejected)' });
      }

      const eksternalData = await Eksternal.findOne({
        where: { user_id: userId },
        include: [{
          model: User,
          as: 'user',
          where: { id_sektor: sektorIdAdmin, id_role: 3 }
        }]
      });

      if (!eksternalData) {
        return res.status(404).json({ error: 'User eksternal tidak ditemukan di sektor ini' });
      }

      await eksternalData.update({
        status_registrasi: action,
        tanggal_approval: new Date()
      });

      await eksternalData.user.update({
        is_approved: action === 'Approved'
      });

      return res.json({
        message: `User eksternal sektor ${sektorIdAdmin} berhasil ${action.toLowerCase()}`
      });
    }

    res.status(405).json({ error: 'Method tidak diizinkan' });

  } catch (error) {
    console.error('Manage eksternal admin satker error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};
