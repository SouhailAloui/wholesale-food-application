const express = require("express");
const { getAllCategories ,addCategory,getCategoryById,getProductsByCategory,getPendingOrdersByClient } = require("../controllers/clientSide");

const router = express.Router();

router.get("/categories", getAllCategories);
router.post("/addCategories",  addCategory);
router.get('/categories/:id', getCategoryById);
router.get('/allProduct/:categoryId', getProductsByCategory);
router.get('/allOrders/:clientId', getPendingOrdersByClient);

module.exports = router;