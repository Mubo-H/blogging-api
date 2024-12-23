const express = require("express");
const userController = require("../controllers/userController");
const blogController = require("../controllers/blogController");
const auth = require("../middleware/auth");

const router = express.Router();

// User Routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Blog Routes
router.post("/blogs", auth, blogController.createBlog);
router.get("/blogs", blogController.getBlogs);
router.get("/blogs/:id", blogController.getBlog);
// Additional routes for updating, deleting blogs, etc.

module.exports = router;
