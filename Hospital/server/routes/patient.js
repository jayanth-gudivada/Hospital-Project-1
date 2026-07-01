const express = require('express');
const { getProfile, updateProfile } = require('../controllers/patientController');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// The patient self-service area (own profile + family) — all routes need a token.
router.use(requireAuth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
