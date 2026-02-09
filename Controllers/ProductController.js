const PRODUCT = require("../Models/Product");
const { cloudinary } = require("../Config/cloudinaryConfig");

const addProduct = async (req, res) => {
  try {
    const { name, description, category, brand, specifications, price, isInStock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const product = await PRODUCT.create({
      name,
      description,
      category,
      brand,
      price,
      isInStock,
      specifications: JSON.parse(specifications),
      image: {
        url: req.file?.secure_url || req.file?.path,       
        public_id: req.file?.public_id || req.file?.filename, 
      },
    });
    let specsParsed = {};
    if (specifications) {
    try {
    specsParsed = JSON.parse(specifications);
     } catch {
    specsParsed = {};
     }
    } 


    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await PRODUCT.find();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await PRODUCT.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await PRODUCT.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await PRODUCT.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      product.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.isInStock = req.body.isInStock ?? product.isInStock;
    if (req.body.specifications) {
      product.specifications = JSON.parse(req.body.specifications);
    }

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q, brand, category } = req.query;
    const filter = {};

    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }
    if (brand) filter.brand = brand;
    if (category) filter.category = category;

    const products = await PRODUCT.find(filter);
    res.json({ products });
  } catch (err) {
    console.error("Search products error:", err);
    res.status(500).json({ message: "Failed to search products" });
  }
};


module.exports = { addProduct, getProducts, deleteProduct, updateProduct, searchProducts };