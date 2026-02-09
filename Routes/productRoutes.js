const express = require("express")
const router = express.Router()

const { addProduct, getProducts, deleteProduct, updateProduct, searchProducts } = require("../Controllers/ProductController")
const { upload } = require("../Config/cloudinaryConfig")

router.post("/addProduct", upload.single("image"), addProduct)
router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.get("/search", searchProducts);

module.exports = router