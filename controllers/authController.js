const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role, Jabatan, Perusahaan, Sektor, eksternal } = require('../models');

// Registrasi untuk user eksternal
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

    // Cari atau buat sektor
    const [sektor] = await Sektor.findOrCreate({ where: { nama_sektor } });

    // Cari atau buat perusahaan
    const [perusahaan] = await Perusahaan.findOrCreate({
      where: { nama_perusahaan },
      defaults: {
        id_sektor: sektor.id,
        status_approval: false
      }
    });

    // Cari atau buat jabatan
    const [jabatan] = await Jabatan.findOrCreate({
      where: { nama_jabatan },
      defaults: {
        id_perusahaan: perusahaan.id
      }
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user
    const user = await User.create({
      nama_lengkap,
      username,
      email,
      no_telp,
      password: hashedPassword,
      id_perusahaan: perusahaan.id,
      id_sektor: sektor.id,
      id_jabatan: jabatan.id,
      id_role: 3, // eksternal
      is_approved: false
    });

    // Tambahkan ke tabel eksternal
    await eksternal.create({
      user_id: user.id,
      status_registrasi: 'Pending'
    });

    res.status(201).json({ message: 'Registrasi berhasil, menunggu approval', user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat registrasi' });
  }
};

// Login
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

    if (!user.is_approved) {
      return res.status(403).json({ error: 'Akun Anda belum disetujui' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Password salah' });

    const token = jwt.sign({ userId: user.id, id_role: user.id_role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      message: 'Login berhasil',
      token,
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

// Approval user eksternal oleh superadmin atau admin sektor
exports.approveEksternal = async (req, res) => {
  const { eksternalUserId, status } = req.body; // status: 'Approved' atau 'Rejected'
  const requester = req.user;

  try {
    if (![1, 2].includes(requester.id_role)) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses untuk approval' });
    }

    const user = await User.findByPk(eksternalUserId);
    if (!user || user.id_role !== 3) {
      return res.status(404).json({ error: 'User eksternal tidak ditemukan' });
    }

    const eksternalData = await eksternal.findOne({ where: { user_id: eksternalUserId } });
    if (!eksternalData) {
      return res.status(404).json({ error: 'Data eksternal tidak ditemukan' });
    }

    await eksternalData.update({
      status_registrasi: status,
      tanggal_approval: new Date()
    });

    await user.update({
      is_approved: status === 'Approved'
    });

    res.json({ message: `User eksternal berhasil ${status.toLowerCase()}` });
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat proses approval' });
  }
};
