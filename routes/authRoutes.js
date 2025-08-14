const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Tanpa JWT, jadi tidak perlu middleware authenticate
router.post('/register', authController.register);
router.post('/login', authController.login);
router.route('/eksternal')
  .get(authController.manageEksternal)  // lihat semua user eksternal
  .post(authController.manageEksternal) // approve/reject
router.route('/adminsatker') // admin sektor
  .get(authController.manageEksternalAdminSatker)
  .post(authController.manageEksternalAdminSatker);
module.exports = router;
