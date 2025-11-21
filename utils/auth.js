const {User} = require('../models/index.model');
const {ERR} = require('./response');

const checkToken = async(req, res, next) => { 
    const email = req.body?.email || req.params?.email;
    const token = req.body?.token || req.params?.token;

    if(!email || !token) {
        return ERR(res, 400, 'Email and token are required');
    }

    try {
        const user = await User.findOne({email, token});
        if(!user) {
            return ERR(res, 401, 'Unauthorized: Invalid token');
        }
        req.user = user;
        next();
    }catch (error) {
        console.error('checkToken Error:', error);
        return ERR(res, 500, 'Unauthorized: Invalid token');
    }
}

module.exports = {
    checkToken
}