// Family relation is stored in the DB as a fixed-width string code (like role),
// not the label. Keep this in sync with the client's src/lib/relations.ts.
const RELATIONS = {
    father: '01',
    mother: '02',
    brother: '03',
    sister: '04',
    grandfather: '05',
    grandmother: '06',
    uncle: '07',
    aunt: '08',
    son: '09',
    daughter: '10',
    nephew: '11',
    niece: '12',
    spouse: '13',
    other: '99',
};

// All valid codes, used for enum validation.
const RELATION_CODES = Object.values(RELATIONS);

// Reverse map (code -> label) for display/debugging.
const RELATION_LABELS = {
    [RELATIONS.father]: 'Father',
    [RELATIONS.mother]: 'Mother',
    [RELATIONS.brother]: 'Brother',
    [RELATIONS.sister]: 'Sister',
    [RELATIONS.grandfather]: 'Grandfather',
    [RELATIONS.grandmother]: 'Grandmother',
    [RELATIONS.uncle]: 'Uncle',
    [RELATIONS.aunt]: 'Aunt',
    [RELATIONS.son]: 'Son',
    [RELATIONS.daughter]: 'Daughter',
    [RELATIONS.nephew]: 'Nephew',
    [RELATIONS.niece]: 'Niece',
    [RELATIONS.spouse]: 'Spouse',
    [RELATIONS.other]: 'Other',
};

module.exports = { RELATIONS, RELATION_CODES, RELATION_LABELS };
