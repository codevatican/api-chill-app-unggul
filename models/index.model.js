const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email : {
        required: true,
        unique: true,
        type: String
    },
    token : {
        type: String
    },
    favoriteMovies: Array
})

module.exports = {
    User: mongoose.model('User', UserSchema)
}