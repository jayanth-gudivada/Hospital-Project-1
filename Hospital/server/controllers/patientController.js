const Login = require('../models/Login');
const HrdFamily = require('../models/HrdFamily');
const asyncHandler = require('../utils/asyncHandler');
const getNextSequence = require('../utils/sequence');
const { GENDER_CODES } = require('../constants/genders');
const { RELATION_CODES } = require('../constants/relations');

// The profile shape sent to the client (never the password hash).
function publicProfile(user) {
    return {
        Id: user.Id,
        firstName: user.firstName,
        middleName: user.middleName || '',
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        role: user.role,
    };
}

// A single family row as returned to the client.
function publicFamily(row) {
    return {
        Id: row.Id,
        firstName: row.firstName,
        middleName: row.middleName || '',
        lastName: row.lastName,
        email: row.email || '',
        dateOfBirth: row.dateOfBirth || '',
        phone: row.phone || '',
        gender: row.gender || '',
        address: row.address || '',
        relation: row.relation,
    };
}

// Normalises a date-of-birth input to an ISO-8601 string, or '' when blank.
// Returns null to signal an unparseable value (caller turns that into a 400).
function toIsoDate(value) {
    if (value === undefined || value === null || String(value).trim() === '') return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
}

// Legacy rows may predate the integer Id; make sure the signed-in user has one
// before we use it as the family foreign key.
async function ensureUserId(user) {
    if (user.Id === undefined || user.Id === null) {
        user.Id = await getNextSequence('login');
        await user.save({ validateBeforeSave: false });
    }
    return user.Id;
}

// GET /api/patient/profile  (protected)
// Returns the signed-in user's profile plus their family list, for auto-populating
// the Profile screen.
const getProfile = asyncHandler(async (req, res) => {
    const user = await Login.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    const userId = await ensureUserId(user);
    const family = await HrdFamily.find({ userId }).sort({ Id: 1 });
    return res.json({ profile: publicProfile(user), family: family.map(publicFamily) });
});

// PUT /api/patient/profile  (protected)
// Saves the whole Profile screen in one request: the user's own details and the
// full family table. Family rows are synced by Id — rows with an Id are updated,
// rows without one are inserted (new auto-increment Id), and any existing row not
// present in the payload is deleted (the user removed it in the UI).
const updateProfile = asyncHandler(async (req, res) => {
    const user = await Login.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    const userId = await ensureUserId(user);

    const { firstName, middleName, lastName, email, phone, dateOfBirth, gender, address } = req.body;

    // ----- Validate + build the profile update -----
    if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ msg: 'first name, last name, email and phone are required' });
    }
    if (gender && !GENDER_CODES.includes(String(gender))) {
        return res.status(400).json({ msg: 'invalid gender' });
    }
    const dob = toIsoDate(dateOfBirth);
    if (dob === null) {
        return res.status(400).json({ msg: 'invalid date of birth' });
    }

    // Email and phone stay unique across all users (exclude the current user).
    const emailNorm = String(email).toLowerCase().trim();
    if (emailNorm !== user.email) {
        if (await Login.findOne({ email: emailNorm, _id: { $ne: user._id } })) {
            return res.status(409).json({ msg: 'A user with that email already exists' });
        }
    }
    const phoneNorm = String(phone).trim();
    if (phoneNorm !== user.phone) {
        if (await Login.findOne({ phone: phoneNorm, _id: { $ne: user._id } })) {
            return res.status(409).json({ msg: 'A user with that phone number already exists' });
        }
    }

    Object.assign(user, {
        firstName,
        middleName: middleName || undefined,
        lastName,
        email: emailNorm,
        phone: phoneNorm,
        dateOfBirth: dob,
        gender: gender || undefined,
        address: address || undefined,
        // The profile is now complete — clear the gate so the prompt stops appearing.
        profileFill: 0,
    });
    await user.save({ runValidators: true });

    // ----- Sync the family table -----
    const incoming = Array.isArray(req.body.family) ? req.body.family : [];
    const existing = await HrdFamily.find({ userId }).select('Id');
    const existingIds = new Set(existing.map((r) => r.Id));
    const keptIds = new Set(
        incoming.map((m) => Number(m.Id)).filter((id) => Number.isFinite(id) && existingIds.has(id))
    );

    // Delete rows the user removed in the UI.
    const toDelete = [...existingIds].filter((id) => !keptIds.has(id));
    if (toDelete.length) {
        await HrdFamily.deleteMany({ userId, Id: { $in: toDelete } });
    }

    // Upsert each incoming member.
    for (const m of incoming) {
        const memberDob = toIsoDate(m.dateOfBirth);
        if (memberDob === null) {
            return res.status(400).json({ msg: 'invalid date of birth for a family member' });
        }
        if (m.relation === undefined || !RELATION_CODES.includes(String(m.relation))) {
            return res.status(400).json({ msg: 'each family member needs a valid relation' });
        }
        const fields = {
            userId,
            firstName: m.firstName,
            middleName: m.middleName || undefined,
            lastName: m.lastName,
            email: m.email ? String(m.email).toLowerCase().trim() : undefined,
            dateOfBirth: memberDob,
            phone: m.phone || undefined,
            gender: m.gender || undefined,
            address: m.address || undefined,
            relation: String(m.relation),
        };

        const id = Number(m.Id);
        if (Number.isFinite(id) && existingIds.has(id)) {
            await HrdFamily.updateOne({ userId, Id: id }, { $set: fields }, { runValidators: true });
        } else {
            fields.Id = await getNextSequence('hrdfamily');
            await HrdFamily.create(fields);
        }
    }

    const family = await HrdFamily.find({ userId }).sort({ Id: 1 });
    return res.json({ profile: publicProfile(user), family: family.map(publicFamily) });
});

module.exports = { getProfile, updateProfile };
