const express = require("express");
const {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCateoryCtrl,
} = require("../../controllers/courseCategory/courseCat");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const courseCategory = express.Router();

courseCategory.post("/", createCategoryCtrl);
courseCategory.get("/", fetchCategoriesCtrl);
courseCategory.get("/:id", authMiddleware, fetchCategoryCtrl);
courseCategory.put("/:id", authMiddleware, updateCategoryCtrl);
courseCategory.delete("/:id", authMiddleware, deleteCateoryCtrl);


module.exports = courseCategory;
