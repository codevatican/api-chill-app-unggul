const {ERR, OK} = require('../utils/response');
const { User } = require('../models/index.model');

const GetFavoriteMovies = async (req, res) => {
    return OK(res, 200, req.user, 'Favorite movies retrieved successfully');
}

const AddFavoriteMovie = async (req, res) => {
    try {
        const {data} = req.body;
        const user = await User.findById(req.user._id);
        user.favoriteMovies.push(data);
        await user.save();
        return OK(res, 201, user.favoriteMovies, 'Favorite movie added successfully');
    } catch (error) {
        console.error(error);
        return ERR(res, 500, 'Internal Server Error (AddFavoriteMovie)');
    }
}

const RemoveFavoriteMovie = async (req, res) => {
    try {
        const {movieID} = req.body;
        const user = await User.findById(req.user._id);
        const existingMovie = user.favoriteMovies.some(movie => movie.id === movieID);
        if(!existingMovie){
            return ERR(res, 404, 'Movie not found in favorites');
        }

        user.favoriteMovies = user.favoriteMovies.filter(movie => movie.id !== movieID);
        

        await user.save();
        return OK(res, 204, null, 'Favorite movie removing successfully');
    } catch (error) {
        return ERR(res, 500, 'Internal Server Error (RemoveFavoriteMovie)');
    }
}

const SignInToken = async (req, res) => {
    try {
        const {email, token} = req.body;
        let user = await User.findOne({ email });
        if(user){
            user.token = token;
        }else{
            user = new User({email, token});
        }
        await user.save();
        
        return OK(res, 200, null, 'Token is valid');
    } catch (error) {
        return ERR(res, 500, 'Internal Server Error (SignInToken)');
    }
}

const SignOutToken = async (req, res) => {
    const user = await User.findById(req.user._id);
    user.token = null;
    await user.save();
    return OK(res, 204, null, 'Sign out successful');
}

module.exports = {
    SignInToken,
    SignOutToken,
    GetFavoriteMovies,
    AddFavoriteMovie,
    RemoveFavoriteMovie
}