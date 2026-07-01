// Roles are stored in the DB as fixed-width string codes ("01", "02", "03"),
// not as the role names. Keep this in sync with the client's src/lib/roles.ts.
const ROLES = {
    patient: '01',
    doctor: '02',
    admin: '03',
};

// All valid codes, used for enum validation: ['01', '02', '03'].
const ROLE_CODES = Object.values(ROLES);

module.exports = { ROLES, ROLE_CODES };
