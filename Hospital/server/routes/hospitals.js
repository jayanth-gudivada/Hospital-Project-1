const express = require('express');
const {
    listHospitals,
    createHospital,
    updateHospital,
    deleteHospital,
} = require('../controllers/hospitalController');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Public read; protected writes.
router.get('/', listHospitals);
router.post('/', requireAuth, createHospital);
router.put('/:id', requireAuth, updateHospital);
router.delete('/:id', requireAuth, deleteHospital);

module.exports = router;
