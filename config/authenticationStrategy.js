require('dotenv').config();
const{getToken} = require('../models/TokenBlackList');
const { getUser } = require('../models/User');
const { tokenFromCookie } = require('../lib/utils');
const jwt = require('jsonwebtoken');
// Secret key for siging and verify the token
const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = async(req, res, next) => {
    try{
console.log('entered the auth')
    
    let token = tokenFromCookie(req);
    if (!token) {
        return res.status(401).json({ success: false, message: 'error while grabing the token from the cookie' })
    }
        const response =await getToken(token)
        if(response){

            return res.status(401).json({ success: false, message: 'you are using a blackListed token ' })


        }

    const isVerified =  jwt.verify(token, SECRET_KEY);
    if (!isVerified) {
        return res.status(401).json({ success: false, message: 'invalide token ' })
    }
    // console.log(req.body)
    const {username} = req.body;
    if(!username){
        return res.status(401).json({ success: false, message: 'username is required ' })

    }
    getUser(username)
        .then(user => {
            if (user) {
                return next()
            }else{
                return res.status(401).json({ success: false, message: 'username not found ' })
            }
            console.log('entered the hehehe')



            

        }).catch(err =>{
            console.log('ERROR WHILE FINDING THE USER')
            next(err)});

    } catch (error) {
        if (error.name === 'TokenExpiredError') {

            // Handle TokenExpiredError here

            return res.status(401).json({ success: false, message: 'Token has expired' });
        } else {
            
            // Handle other JWT verification errors

            console.log('JWT verification error:', error);
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
    }
}
module.exports = {
    authenticate

}