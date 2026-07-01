const express = require('express');
const {
    listHospitals,
    createHospital,
    updateHospital,
    deleteHospital,
} = require('../controllers/hospitalController');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Public read (used by the landing-page search); admin-only writes.
const adminOnly = [requireAuth, requireRole(ROLES.admin)];
router.get('/', listHospitals);
router.post('/', adminOnly, createHospital);
router.put('/:id', adminOnly, updateHospital);
router.delete('/:id', adminOnly, deleteHospital);

module.exports = router;
