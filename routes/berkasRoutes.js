// routes/berkasRoutes.js
const express = require('express');
const router = express.Router();
const berkasController = require('../controllers/berkasController');

router.post('/upload', berkasController.uploadMiddleware, berkasController.uploadBerkas);
router.get('/satker', berkasController.adminSatkerHandlerGet);
router.post('/satker', berkasController.adminSatkerHandlerPost);
router.get('/superadmin/berkas', berkasController.superadminGetAllBerkas);
// Download berkas
router.get('/superadmin/berkas/:id/download', berkasController.superadminDownloadBerkas);
// Approve berkas
router.put('/superadmin/berkas/:id/approve', berkasController.superadminApproveBerkas);
// Reject berkas
router.put('/superadmin/berkas/:id/reject', berkasController.superadminRejectBerkas);

module.exports = router;
