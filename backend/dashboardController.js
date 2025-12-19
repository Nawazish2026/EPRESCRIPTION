const Prescription = require('./models/Prescription'); // Ensure this path matches your model structure

/**
 * @desc    Get dashboard statistics (Patients treated & Common diagnoses)
 * @route   GET /api/dashboard/stats
 * @access  Private (Doctor)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Chart 1: Patients treated this week (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const treatedStats = await Prescription.aggregate([
      {
        $match: {
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
      // If diagnosis is stored as an array, uncomment the next line:
      // { $unwind: "$diagnosis" },
      {
        $match: { 
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
    const recentPrescriptions = await Prescription.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: { treatedStats, diagnosisStats, recentPrescriptions }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error fetching stats" });
  }
};