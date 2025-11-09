const router = require('express').Router();
const UserController = require('../controllers/index.controller');
const {checkToken} = require('../utils/auth');

router.get('/my-movies/:email/:token', checkToken, UserController.GetFavoriteMovies);
router.post('/my-movies', checkToken, UserController.AddFavoriteMovie);
router.delete('/my-movies', checkToken, UserController.RemoveFavoriteMovie);

router.post('/my-token', UserController.SignInToken);
router.delete('/my-token', checkToken, UserController.SignOutToken);

module.exports = router;