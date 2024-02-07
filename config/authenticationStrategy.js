require('dotenv').config();
const{getToken} = require('../models/TokenBlackList');
const { getUser } = require('../models/User');
const { tokenFromCookie } = require('../lib/utils');
const jwt = require('jsonwebtoken');
// Secret key for siging and verify the token
const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = async(req, res, next) => {
    try{
// console.log('entered the auth')
    
    const token = tokenFromCookie(req);
    // console.log(token)
    if (!token) {
        return res.status(401).json({ success: false, message: 'error while grabing the token from the cookie' })
    }
        const response =await getToken(token)
        if(response){
            return res.status(403).json({ success: false, message: 'you are using a blackListed token ' })
        }
        console.log(token)
    const isVerified =  jwt.verify(token, SECRET_KEY);
        // console.log(isVerified,token)

    // console.log("isVerified ",isVerified)

        // console.log(Date.now() ,'   ', isVerified.exp * 1000)
    if (!isVerified) {
        console.log('TOEKN',token)
        
        return res.status(404).json({ success: false, message: 'invalide token ' })
    } 
   
       
                return next()
          

    } catch (error) {
    

        if (error.name === 'TokenExpiredError') {
console.log('ERRROR',error)
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