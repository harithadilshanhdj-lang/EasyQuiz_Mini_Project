const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Grade = require("../models/Grade");

const { auth, studentOnly } = require("../middlewere/authMiddleware");

// GET CURRENT STUDENT PROGRESS INFORMATION
router.get("/", auth, studentOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("grade");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.grade) {
      return res.status(400).json({
        success: false,
        message: "No grade assigned to this student",
      });
    }

    const grade = await Grade.findById(student.grade).select("name");

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: "Assigned grade not found",
      });
    }

    return res.json({
      success: true,
      grade: {
        id: grade._id,
        name: grade.name,
      },
    });
  } catch (error) {
    console.error("GET STUDENT PROGRESS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student progress",
    });
  }
});

module.exports = router;