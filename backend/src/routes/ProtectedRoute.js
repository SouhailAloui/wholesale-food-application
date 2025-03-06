const express = require('express');
const router = express.Router();
const { authenticate} = require('../middleware/authenticate');

router.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: `Hello, user with ID: ${req.user.userId}` });
});

module.exports = router;
