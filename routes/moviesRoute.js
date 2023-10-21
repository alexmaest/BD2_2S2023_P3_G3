const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

router.get('/load', moviesController.loadMoviesData);

router.get('/', moviesController.getMovies);
router.post('/', moviesController.createMovie);
router.put('/', moviesController.updateMovie);
router.delete('/:id', moviesController.deleteMovie);

router.get('/genre/:genero', moviesController.findByGenre);
router.get('/clasification/:clasificacion', moviesController.findByClasification);
router.get('/director/:director', moviesController.findByDirector);
router.get('/price/:precio', moviesController.findByPrice);

module.exports = router;
