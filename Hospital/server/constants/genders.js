// Gender is stored in the DB as a fixed-width string code (like role), not the
// label. Keep this in sync with the client's src/lib/genders.ts.
const GENDERS = {
    male: '01',
    female: '02',
    trans: '03',
    other: '04',
};

// All valid codes, used for enum validation: ['01', '02', '03', '04'].
const GENDER_CODES = Object.values(GENDERS);

// Reverse map (code -> label) for display/debugging.
const GENDER_LABELS = {
    [GENDERS.male]: 'Male',
    [GENDERS.female]: 'Female',
    [GENDERS.trans]: 'Trans',
    [GENDERS.other]: 'Other',
};

module.exports = { GENDERS, GENDER_CODES, GENDER_LABELS };
