const express = require('express');
const router = express.Router();
const sektorController = require('../controllers/sektorController');

router.get('/tampilsektor', sektorController.getAllSektor);

module.exports = router;
