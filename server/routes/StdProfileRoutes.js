const express = require("express");
const router = express.Router();

const { auth, studentOnly } = require("../middlewere/authMiddleware");
const upload = require("../middlewere/upload");

const studentProfileController = require("../controllers/studentProfileController");

console.log("📌 StdProfileRoutes Loaded Successfully");

router.get(
  "/", 
  auth, 
  studentOnly, 
  studentProfileController.getStudentProfile
);

router.put(
  "/update",
  auth,
  studentOnly,
  studentProfileController.updateStudentProfile
);

router.put(
  "/update-image",
  auth,
  studentOnly,
  upload.single("profileImage"),
  studentProfileController.updateProfileImage
);

router.delete(
  "/remove-image",
  auth,
  studentOnly,
  studentProfileController.removeProfileImage
);

router.put(
  "/change-password",
  auth,
  studentOnly,
  studentProfileController.changeStudentPassword
);

router.delete(
  "/delete-account",
  auth,
  studentOnly,
  studentProfileController.deleteStudentAccount
);

module.exports = router;