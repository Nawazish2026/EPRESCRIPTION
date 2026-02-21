const Prescription = require('./models/Prescription'); // Ensure this path matches your model structure
const { getCache, setCache } = require('./config/redis');

/**
 * @desc    Get dashboard statistics (Patients treated & Common diagnoses)
 * @route   GET /api/dashboard/stats
 * @access  Private (Doctor)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Check Cache first (scoped to user role)
    // Note: If using User object, ensure `req.user` is populated (via verifyToken)
    const roleId = req.user ? req.user.id : 'global';
    const cacheKey = `dashboard:stats:${roleId}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: cachedData,
        cached: true
      });
    }

    // 1. Chart 1: Patients treated this week (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Filter stage for queries based on user context
    const matchStage = (req.user && req.user.role !== 'admin')
      ? { doctor: require('mongoose').Types.ObjectId.createFromHexString(req.user.id) }
      : {};

    const treatedStats = await Prescription.aggregate([
      {
        $match: {
          ...matchStage,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // Sort by date ascending
    ]);

    // 2. Chart 2: Most Common Diagnosis (Top 5)
    const diagnosisStats = await Prescription.aggregate([
      {
        $match: {
          ...matchStage,
          diagnosis: { $exists: true, $ne: "" }
        }
      },
      {
        $group: {
          _id: "$diagnosis",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }, // Sort by count descending
      { $limit: 5 }
    ]);

    // 3. Recent Prescriptions (Last 5) for Patient Details
    const recentPrescriptions = await Prescription.find(matchStage)
      .sort({ createdAt: -1 })
      .limit(5);

    const data = { treatedStats, diagnosisStats, recentPrescriptions };

    // Set cache for 2 minutes (120 seconds)
    await setCache(cacheKey, data, 120);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error fetching stats" });
  }
};