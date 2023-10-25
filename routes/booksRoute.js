const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

//router.get('/', booksController.getBooks);
router.get('/load', booksController.loadBooksData);

router.get('/', booksController.getBooks);
router.post('/', booksController.createBook);
router.put('/', booksController.updateBook);
router.delete('/:_id', booksController.deleteBook);

router.get('/available', booksController.getAvailableBooks);
router.get('/category/:category', booksController.findByCategory);
router.get('/author/:author', booksController.findByAuthor);
router.get('/averageRatingSort', booksController.averageRatingSort);
router.get('/priceLowerThan20', booksController.priceLowerThan20);
router.get('/titleAndDescriptionKeyword/:keyword', booksController.titleAndDescriptionKeyword);

module.exports = router;
