const Info = require('../models/Info');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/hospitals?search=&page=&limit=
// Public listing. Supports optional server-side search + pagination.
const listHospitals = asyncHandler(async (req, res) => {
    const { search = '', page = 1, limit = 0 } = req.query;

    const filter = {};
    if (search.trim()) {
        // Escape regex metacharacters so user input is matched literally.
        const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ name: rx }, { location: rx }, { address: rx }];
    }

    const query = Info.find(filter).sort({ createdAt: -1 });

    const lim = parseInt(limit, 10) || 0;
    const pg = parseInt(page, 10) || 1;
    if (lim > 0) {
        query.skip((pg - 1) * lim).limit(lim);
    }

    // Fetch the page and the unfiltered total in parallel for the grid's pager.
    const [items, total] = await Promise.all([
        query.exec(),
        Info.countDocuments(filter),
    ]);

    return res.json({ items, total, page: pg, limit: lim });
});

// POST /api/hospitals  { name, location, address }  (protected)
const createHospital = asyncHandler(async (req, res) => {
    const { name, location, address } = req.body;
    if (!name || !location || !address) {
        return res.status(400).json({ msg: 'name, location and address are required' });
    }
    const hospital = await Info.create({ name, location, address });
    return res.status(201).json({ hospital });
});

// PUT /api/hospitals/:id  { name, location, address }  (protected)
const updateHospital = asyncHandler(async (req, res) => {
    const { name, location, address } = req.body;
    const hospital = await Info.findByIdAndUpdate(
        req.params.id,
        { name, location, address },
        { new: true, runValidators: true }
    );
    if (!hospital) {
        return res.status(404).json({ msg: 'Hospital not found' });
    }
    return res.json({ hospital });
});

// DELETE /api/hospitals/:id  (protected)
const deleteHospital = asyncHandler(async (req, res) => {
    const hospital = await Info.findByIdAndDelete(req.params.id);
    if (!hospital) {
        return res.status(404).json({ msg: 'Hospital not found' });
    }
    return res.json({ msg: 'Hospital deleted', id: req.params.id });
});

module.exports = { listHospitals, createHospital, updateHospital, deleteHospital };
