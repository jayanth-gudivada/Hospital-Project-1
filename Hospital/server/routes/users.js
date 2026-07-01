const express = require('express');
const {
    listUsers,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// All user-management routes require a valid token AND an admin role — otherwise
// any signed-in user could list/create/edit/delete accounts (and self-promote).
router.use(requireAuth, requireRole(ROLES.admin));

router.get('/', listUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
