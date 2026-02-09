const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../Middlewares/Auth.js");
const adminController = require("../Controllers/AdminController");
const { upload } = require("../Config/cloudinaryConfig");


// Admin dashboard
router.get("/dashboard", auth, isAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard" });
});

// Products management
router.get("/products", auth, isAdmin, adminController.getProducts);
router.post("/products", auth, isAdmin, upload.single("image"), adminController.addProduct);
router.put("/products/:id", auth, isAdmin, upload.single("image"), adminController.updateProduct);
router.delete("/products/:id", auth, isAdmin, adminController.deleteProduct);


module.exports = router;