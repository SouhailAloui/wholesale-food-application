const express = require("express");
const { addProductByWholesaler,getProductsByWholesaler,getProductsByCategoryAndUser } = require("../controllers/wholesalesSide");
const upload = require('../config/uploadImage');

const router = express.Router();

router.post("/addProduct/:wholesalerId/:categoryId", upload.single('image'), addProductByWholesaler);
router.get("/getProduct/:wholesalerId", getProductsByWholesaler);
router.get("/getProductByCategoryAndUser/:wholesalerId/:categoryId", getProductsByCategoryAndUser);

module.exports = router;