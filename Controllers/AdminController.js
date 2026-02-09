const Product = require("../Models/Product");
const { cloudinary } = require("../Config/cloudinaryConfig");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, brand, specifications, price, isInStock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    let specsParsed = {};
    if (specifications) {
      try {
        specsParsed = JSON.parse(specifications);
      } catch {
        specsParsed = {};
      }
    }

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      price,
      isInStock,
      specifications: specsParsed,
      image: {
        url: req.file?.secure_url || req.file?.path,
        public_id: req.file?.public_id || req.file?.filename,
      },
    });
    console.log(product);
    

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
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
    console.log(product);
    
    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};