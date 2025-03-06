const Category = require("../models/CategorySchema");
const Product = require("../models/ProductSchema"); // Import Product model


// Get all products by wholesaler ID
const getProductsByWholesaler = async (req, res) => {
  try {
    const { wholesalerId } = req.params; // Get wholesaler ID from request params

    const products = await Product.find({ wholesaler: wholesalerId })
      .populate("category", "name") // Populate category name
      .populate("wholesaler", "name email"); // Populate wholesaler details

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this wholesaler." });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProductByWholesaler = async (req, res) => {
  try {

    const { name, description, price, quantityAvailable } = req.body;
    const { wholesalerId, categoryId } = req.params;   // Get wholesalerId and categoryId from URL params

    if (!name || !price || !quantityAvailable || !categoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Add logic to handle the category ID if needed (e.g., lookup in the database)
    const newProduct = {
      name,
      description,
      price,
      quantityAvailable,
      category: categoryId,  // Using the categoryId from the URL
      wholesaler: wholesalerId, 
      image: req.file ? req.file.path : null, // Cloudinary URL
    };

    const savedProduct = await Product.create(newProduct);
    
    res.status(201).json({ message: "Product added successfully", product: savedProduct });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getProductsByCategoryAndUser = async (req, res) => {
  try {
    const { categoryId, wholesalerId} = req.params;

    // Validate categoryId and userId
    if (!categoryId || !wholesalerId ) {
      return res.status(400).json({ message: "Category ID and User ID are required" });
    }

    // Fetch products based on category and wholesaler (user)
    const products = await Product.find({
      category: categoryId,
      wholesaler: userId
    })
      .populate("category", "name description") // Populate category details
      .populate("wholesaler", "name email"); // Populate wholesaler details

    // Check if products were found
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this category and user" });
    }

    // Return the products
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = { getProductsByWholesaler,addProductByWholesaler,getProductsByCategoryAndUser };