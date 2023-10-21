const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

router.get('/', booksController.getBooks);
router.get('/load', booksController.loadBooksData);

module.exports = router;
