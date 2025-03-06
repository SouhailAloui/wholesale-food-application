const Category = require("../models/CategorySchema");
const Product = require("../models/ProductSchema");
const Order = require("../models/OrderSchema");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories
    res.status(200).json(categories); // Send the categories as a response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
  
      // Check if the category name already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }
  
      // Create a new category
      const newCategory = new Category({ name, description });
      await newCategory.save();
  
      res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getCategoryById = async (req, res) => {
    try {
      const { id } = req.params; // Get category ID from request parameters
      const category = await Category.findById(id); // Fetch category by ID
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.status(200).json(category); // Send category data as response
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  const getProductsByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      const products = await Product.find({ category: categoryId })
        .populate("category", "name") // Populate category name
        .populate("wholesaler", "name email"); // Populate wholesaler info
  
      if (!products.length) {
        return res.status(404).json({ message: "No products found for this category." });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getPendingOrdersByClient = async (req, res) => {
    try {
      const { clientId } = req.params; // Get client ID from request params
  
      const pendingOrders = await Order.find({ supermarket: clientId, status: "pending" })
        .populate("supermarket", "name email") // Populate supermarket details (name & email)
        .populate("wholesaler", "name email") // Populate wholesaler details (name & email)
        .populate("products.product", "name price"); // Populate product details (name & price)
  
      res.status(200).json(pendingOrders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { getAllCategories,addCategory,getCategoryById,getProductsByCategory,getPendingOrdersByClient };