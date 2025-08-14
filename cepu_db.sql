--DROP DATABASE cepu_db;
CREATE DATABASE cepu_db;

USE cepu_db;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2025 at 11:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: cepu_db
--

-- --------------------------------------------------------

--
-- Table structure for table admin_satuankerja
--

CREATE TABLE admin_satuankerja (
  id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  akses tinyint(1) NOT NULL,
  id_satuankerja int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table admin_satuankerja
--

INSERT INTO admin_satuankerja (id, user_id, akses, id_satuankerja) VALUES
(1, 8, 1, 1),
(2, 19, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table approval
--

CREATE TABLE approval (
  id int(11) NOT NULL,
  id_user int(11) NOT NULL,
  id_berkas int(11) NOT NULL,
  status_approval enum('Approved','Rejected','Pending') NOT NULL,
  tanggal_approve datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table approval
--

INSERT INTO approval (id, id_user, id_berkas, status_approval, tanggal_approve) VALUES
(2, 11, 2, 'Approved', '2025-08-07 16:31:07');

-- --------------------------------------------------------

--
-- Table structure for table berkas
--

CREATE TABLE berkas (
  id int(11) NOT NULL,
  id_user int(11) NOT NULL,
  id_perusahaan int(11) NOT NULL,
  id_sektor int(11) NOT NULL,
  nama_file varchar(255) NOT NULL,
  status enum('Approved','Rejected','Waiting') NOT NULL,
  tanggal_upload datetime NOT NULL,
  id_jabatan int(11) DEFAULT NULL,
  id_tipe int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table berkas
--

INSERT INTO berkas (id, id_user, id_perusahaan, id_sektor, nama_file, status, tanggal_upload, id_jabatan, id_tipe) VALUES
(2, 11, 4, 3, 'Laporan Keuangan 2024.pdf', 'Approved', '2025-08-07 16:30:15', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table eksternal
--

CREATE TABLE eksternal (
  id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  status_registrasi enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  tanggal_approval datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table eksternal
--

INSERT INTO eksternal (id, user_id, status_registrasi, tanggal_approval) VALUES
(1, 7, 'Approved', '2025-08-06 13:44:09'),
(2, 7, 'Approved', '2025-08-06 20:42:32'),
(3, 10, 'Pending', NULL),
(4, 11, 'Approved', '2025-08-06 13:45:52'),
(5, 14, 'Pending', NULL),
(6, 17, 'Pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table jabatan
--

CREATE TABLE jabatan (
  id int(11) NOT NULL,
  id_perusahaan int(11) NOT NULL,
  nama_jabatan varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table jabatan
--

INSERT INTO jabatan (id, id_perusahaan, nama_jabatan) VALUES
(4, 2, 'Staf HR'),
(5, 3, 'Staf IT'),
(6, 4, 'Staf HRD');

-- --------------------------------------------------------

--
-- Table structure for table permissions
--

CREATE TABLE permissions (
  id int(11) NOT NULL,
  nama_izin varchar(255) NOT NULL,
  deskripsi text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table permissions
--

INSERT INTO permissions (id, nama_izin, deskripsi) VALUES
(1, 'kelola_user', 'Membuat, mengedit, dan menghapus semua akun pengguna.'),
(2, 'kelola_peran', 'Mengelola peran dan izin di tabel roles dan role_permissions.'),
(3, 'kelola_data_master', 'Mengelola semua data master seperti sektor, perusahaan, dan jabatan.'),
(4, 'approve_semua', 'Menyetujui semua jenis pendaftaran atau berkas di seluruh sistem.'),
(5, 'lihat_semua_log', 'Melihat semua log aktivitas dan laporan di seluruh sistem.'),
(6, 'lihat_perusahaan_sektor', 'Melihat daftar perusahaan yang berada di sektornya.'),
(7, 'kelola_berkas_sektor', 'Mengelola (melihat, menyetujui, menolak) berkas dari perusahaan di sektornya.'),
(8, 'approve_pendaftaran_sektor', 'Menyetujui atau menolak pendaftaran akun eksternal di sektornya.'),
(9, 'lihat_laporan_sektor', 'Melihat laporan khusus untuk sektor yang menjadi tanggung jawabnya.'),
(10, 'ubah_profil_sendiri', 'Mengedit informasi profil akun sendiri.'),
(11, 'upload_berkas', 'Mengunggah berkas untuk perusahaan sendiri.'),
(12, 'lihat_status_berkas_sendiri', 'Melihat status berkas yang telah diunggahnya.'),
(13, 'lihat_data_perusahaan_sendiri', 'Melihat detail dan status perusahaan sendiri.');

-- --------------------------------------------------------

--
-- Table structure for table perusahaan
--

CREATE TABLE perusahaan (
  id int(11) NOT NULL,
  id_sektor int(11) NOT NULL,
  nama_perusahaan varchar(255) NOT NULL,
  status_approval tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table perusahaan
--

INSERT INTO perusahaan (id, id_sektor, nama_perusahaan, status_approval) VALUES
(2, 3, 'PT PPSDM Migas', 0),
(3, 4, 'PT pertamina', 0),
(4, 4, 'migas', 0);

-- --------------------------------------------------------

--
-- Table structure for table roles
--

CREATE TABLE roles (
  id int(11) NOT NULL,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL,
  nama_role varchar(255) DEFAULT NULL,
  deskripsi text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table roles
--

INSERT INTO roles (id, createdAt, updatedAt, nama_role, deskripsi) VALUES
(1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Superadmin', 'Administrator dengan hak akses penuh ke semua fitur.'),
(2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Admin_satuan_kerja', 'Administrator yang mengelola data di tingkat satuan kerja.'),
(3, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'eksternal', 'Pengguna dari perusahaan eksternal.');

-- --------------------------------------------------------

--
-- Table structure for table role_permissions
--

CREATE TABLE role_permissions (
  id_role int(11) NOT NULL,
  id_permission int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table role_permissions
--

INSERT INTO role_permissions (id_role, id_permission) VALUES
(1, 1),
(1, 2),
(1, 4),
(2, 6),
(2, 7),
(2, 8),
(3, 10),
(3, 11),
(3, 12),
(3, 13);

-- --------------------------------------------------------

--
-- Table structure for table satuankerja
--

CREATE TABLE satuankerja (
  id int(11) NOT NULL,
  nama_satker varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table satuankerja
--

INSERT INTO satuankerja (id, nama_satker) VALUES
(1, 'Satuan Kerja A'),
(2, 'Satuan Kerja B'),
(3, 'Satuan Kerja C');

-- --------------------------------------------------------

--
-- Table structure for table sdm
--

CREATE TABLE sdm (
  id int(11) NOT NULL,
  id_jabatan int(11) NOT NULL,
  nama_sdm varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  tanggal_masuk date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table sektor
--

CREATE TABLE sektor (
  id int(11) NOT NULL,
  nama_sektor varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table sektor
--

INSERT INTO sektor (id, nama_sektor) VALUES
(2, 'IT'),
(3, 'Sektor SDM'),
(4, 'Sektor minyak');

-- --------------------------------------------------------

--
-- Table structure for table struktur_organisasi
--

CREATE TABLE struktur_organisasi (
  id int(11) NOT NULL,
  id_perusahaan int(11) NOT NULL,
  nama_struktur varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table tipe_berkas
--

CREATE TABLE tipe_berkas (
  id int(11) NOT NULL,
  nama_tipe varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table tipe_berkas
--

INSERT INTO tipe_berkas (id, nama_tipe) VALUES
(1, 'Dokumen Keuangan'),
(2, 'Dokumen Legal'),
(3, 'Dokumen Teknis');

-- --------------------------------------------------------

--
-- Table structure for table unit_kerja
--

CREATE TABLE unit_kerja (
  id int(11) NOT NULL,
  id_satker int(11) DEFAULT NULL,
  nama_unit varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table users
--

CREATE TABLE users (
  id int(11) NOT NULL,
  email varchar(255) DEFAULT NULL,
  password varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  nama_lengkap varchar(255) DEFAULT NULL,
  no_telp varchar(255) DEFAULT NULL,
  id_role int(11) DEFAULT NULL,
  id_perusahaan int(11) DEFAULT NULL,
  id_jabatan int(11) DEFAULT NULL,
  id_sektor int(11) DEFAULT NULL,
  is_approved tinyint(1) DEFAULT 0,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table users
--

INSERT INTO users (id, email, password, username, nama_lengkap, no_telp, id_role, id_perusahaan, id_jabatan, id_sektor, is_approved, createdAt, updatedAt) VALUES
(7, 'rifda@example.com', '$2b$10$pHCjndS5GsPUsX6TiaJ5xuH3FMjK0QrhCw2GBtL8srF9UuJzAllIS', 'edril', 'edril', '0899997834', 3, 4, 2, 3, 1, '2025-07-31 20:45:53', '2025-08-06 13:23:05'),
(8, 'rifda@gmail.com', '$2b$10$KuheB4Fixc3MjP0GZGIMPe/g28XingBNOH7/GyoKrAU3ioTdLGVDm', 'rifdaf', 'Rifda Farnida', '0897654321', 2, 2, 4, 2, 0, '2025-07-31 13:52:04', '2025-07-31 13:52:04'),
(10, 'rifda0899@gmail.com', '$2b$10$sDyMZcm3W8MD40iKfqXGzeqYqKRiRsqkLqhrf/iDl/dbg33aqFOz.', 'ayaya', 'ayaya', '0897654321', 1, 2, 4, 1, 0, '2025-08-04 01:54:58', '2025-08-04 01:54:58'),
(11, 'acha9@gmail.com', '$2b$10$NUIBXtexz2Hk01y0SiTKe.PKKjMp7quTBA6Vw3xk5itqa4Z./yC3u', 'acha', 'acha', '0897654321', 3, 3, 5, 4, 1, '2025-08-04 02:07:21', '2025-08-06 13:45:52'),
(14, 'ahaha9@gmail.com', '$2b$10$pMo4dlT98t5b6CXQj7OKTue9yrANBFkZa97vNguiOuqGQGOgAqqOm', 'ahahah', 'ahaha', '0897654321', 3, 3, 5, 4, 0, '2025-08-06 12:48:41', '2025-08-06 12:48:41'),
(17, 'faisal009@mail.com', '$2b$10$wOVSlk1eJ1fwROurQ1HjyOJt6N9ISm1z3as5NJ0Qn.ewgYxEWra36', 'faisal', 'faisal', '08897654321', 3, 4, 6, 4, 0, '2025-08-06 12:53:52', '2025-08-06 12:53:52'),
(19, 'admin.contoh@example.com', 'password_hash_disini', 'admin_satker_contoh', 'Admin Satker Contoh', '08123456789', 2, 1, 1, 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table admin_satuankerja
--
ALTER TABLE admin_satuankerja
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY fk_admin_satuan_kerja (id_satuankerja);

--
-- Indexes for table approval
--
ALTER TABLE approval
  ADD PRIMARY KEY (id),
  ADD KEY id_user (id_user),
  ADD KEY id_berkas (id_berkas);

--
-- Indexes for table berkas
--
ALTER TABLE berkas
  ADD PRIMARY KEY (id),
  ADD KEY id_user (id_user),
  ADD KEY id_perusahaan (id_perusahaan),
  ADD KEY id_sektor (id_sektor),
  ADD KEY fk_berkas_jabatan (id_jabatan),
  ADD KEY fk_berkas_tipe (id_tipe);

--
-- Indexes for table eksternal
--
ALTER TABLE eksternal
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id);

--
-- Indexes for table jabatan
--
ALTER TABLE jabatan
  ADD PRIMARY KEY (id),
  ADD KEY id_perusahaan (id_perusahaan);

--
-- Indexes for table permissions
--
ALTER TABLE permissions
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY nama_izin (nama_izin);

--
-- Indexes for table perusahaan
--
ALTER TABLE perusahaan
  ADD PRIMARY KEY (id),
  ADD KEY id_sektor (id_sektor);

--
-- Indexes for table roles
--
ALTER TABLE roles
  ADD PRIMARY KEY (id);

--
-- Indexes for table role_permissions
--
ALTER TABLE role_permissions
  ADD PRIMARY KEY (id_role,id_permission),
  ADD KEY id_permission (id_permission);

--
-- Indexes for table satuankerja
--
ALTER TABLE satuankerja
  ADD PRIMARY KEY (id);

--
-- Indexes for table sdm
--
ALTER TABLE sdm
  ADD PRIMARY KEY (id),
  ADD KEY id_jabatan (id_jabatan);

--
-- Indexes for table sektor
--
ALTER TABLE sektor
  ADD PRIMARY KEY (id);

--
-- Indexes for table struktur_organisasi
--
ALTER TABLE struktur_organisasi
  ADD PRIMARY KEY (id),
  ADD KEY id_perusahaan (id_perusahaan);

--
-- Indexes for table tipe_berkas
--
ALTER TABLE tipe_berkas
  ADD PRIMARY KEY (id);

--
-- Indexes for table unit_kerja
--
ALTER TABLE unit_kerja
  ADD PRIMARY KEY (id),
  ADD KEY id_satker (id_satker);

--
-- Indexes for table users
--
ALTER TABLE users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY username (username),
  ADD UNIQUE KEY username_2 (username),
  ADD UNIQUE KEY username_3 (username),
  ADD UNIQUE KEY username_4 (username),
  ADD UNIQUE KEY username_5 (username),
  ADD UNIQUE KEY username_6 (username),
  ADD UNIQUE KEY username_7 (username),
  ADD UNIQUE KEY username_8 (username),
  ADD UNIQUE KEY username_9 (username),
  ADD UNIQUE KEY username_10 (username),
  ADD UNIQUE KEY username_11 (username),
  ADD UNIQUE KEY username_12 (username),
  ADD UNIQUE KEY username_13 (username),
  ADD UNIQUE KEY username_14 (username),
  ADD UNIQUE KEY username_15 (username),
  ADD UNIQUE KEY username_16 (username),
  ADD UNIQUE KEY username_17 (username),
  ADD UNIQUE KEY email (email),
  ADD UNIQUE KEY email_2 (email),
  ADD UNIQUE KEY email_3 (email),
  ADD UNIQUE KEY email_4 (email),
  ADD UNIQUE KEY email_5 (email),
  ADD UNIQUE KEY email_6 (email),
  ADD UNIQUE KEY email_7 (email),
  ADD UNIQUE KEY email_8 (email),
  ADD UNIQUE KEY email_9 (email),
  ADD UNIQUE KEY email_10 (email),
  ADD UNIQUE KEY email_11 (email),
  ADD UNIQUE KEY email_12 (email),
  ADD UNIQUE KEY email_13 (email),
  ADD UNIQUE KEY email_14 (email),
  ADD UNIQUE KEY email_15 (email),
  ADD UNIQUE KEY email_16 (email),
  ADD UNIQUE KEY email_17 (email),
  ADD UNIQUE KEY email_18 (email),
  ADD UNIQUE KEY email_19 (email);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table admin_satuankerja
--
ALTER TABLE admin_satuankerja
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table approval
--
ALTER TABLE approval
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table berkas
--
ALTER TABLE berkas
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table eksternal
--
ALTER TABLE eksternal
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table jabatan
--
ALTER TABLE jabatan
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table permissions
--
ALTER TABLE permissions
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table perusahaan
--
ALTER TABLE perusahaan
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table roles
--
ALTER TABLE roles
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table satuankerja
--
ALTER TABLE satuankerja
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table sdm
--
ALTER TABLE sdm
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table sektor
--
ALTER TABLE sektor
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table struktur_organisasi
--
ALTER TABLE struktur_organisasi
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table tipe_berkas
--
ALTER TABLE tipe_berkas
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table unit_kerja
--
ALTER TABLE unit_kerja
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table users
--
ALTER TABLE users
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table admin_satuankerja
--
ALTER TABLE admin_satuankerja
  ADD CONSTRAINT admin_satuankerja_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id),
  ADD CONSTRAINT fk_admin_satuan_kerja FOREIGN KEY (id_satuankerja) REFERENCES satuankerja (id);

--
-- Constraints for table approval
--
ALTER TABLE approval
  ADD CONSTRAINT approval_ibfk_1 FOREIGN KEY (id_user) REFERENCES users (id),
  ADD CONSTRAINT approval_ibfk_2 FOREIGN KEY (id_berkas) REFERENCES berkas (id);

--
-- Constraints for table berkas
--
ALTER TABLE berkas
  ADD CONSTRAINT berkas_ibfk_1 FOREIGN KEY (id_user) REFERENCES users (id),
  ADD CONSTRAINT berkas_ibfk_2 FOREIGN KEY (id_perusahaan) REFERENCES perusahaan (id),
  ADD CONSTRAINT berkas_ibfk_3 FOREIGN KEY (id_sektor) REFERENCES sektor (id),
  ADD CONSTRAINT fk_berkas_jabatan FOREIGN KEY (id_jabatan) REFERENCES jabatan (id),
  ADD CONSTRAINT fk_berkas_tipe FOREIGN KEY (id_tipe) REFERENCES tipe_berkas (id);

--
-- Constraints for table eksternal
--
ALTER TABLE eksternal
  ADD CONSTRAINT eksternal_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id);

--
-- Constraints for table jabatan
--
ALTER TABLE jabatan
  ADD CONSTRAINT jabatan_ibfk_1 FOREIGN KEY (id_perusahaan) REFERENCES perusahaan (id);

--
-- Constraints for table perusahaan
--
ALTER TABLE perusahaan
  ADD CONSTRAINT perusahaan_ibfk_1 FOREIGN KEY (id_sektor) REFERENCES sektor (id);

--
-- Constraints for table role_permissions
--
ALTER TABLE role_permissions
  ADD CONSTRAINT role_permissions_ibfk_1 FOREIGN KEY (id_role) REFERENCES roles (id),
  ADD CONSTRAINT role_permissions_ibfk_2 FOREIGN KEY (id_permission) REFERENCES permissions (id);

--
-- Constraints for table sdm
--
ALTER TABLE sdm
  ADD CONSTRAINT sdm_ibfk_1 FOREIGN KEY (id_jabatan) REFERENCES jabatan (id);

--
-- Constraints for table struktur_organisasi
--
ALTER TABLE struktur_organisasi
  ADD CONSTRAINT struktur_organisasi_ibfk_1 FOREIGN KEY (id_perusahaan) REFERENCES perusahaan (id);

--
-- Constraints for table unit_kerja
--
ALTER TABLE unit_kerja
  ADD CONSTRAINT unit_kerja_ibfk_1 FOREIGN KEY (id_satker) REFERENCES satuankerja (id);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
ALTER TABLE berkas
ADD COLUMN file_data LONGBLOB AFTER nama_file;
SHOW VARIABLES LIKE 'max_allowed_packet';
SELECT * FROM jabatan WHERE id = 2;