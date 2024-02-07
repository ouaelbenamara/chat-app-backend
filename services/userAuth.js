const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;



const issueJWT = (user) => {
    const _id = user.id;
    const expiresIn = '1h'

    let token;

    try {
        token = jwt.sign({ sub: _id }, SECRET_KEY,{ expiresIn: expiresIn });


    }
    catch (e) {
        // console.log(e.message)
        return false

    }
    return {
        token:token,
        expires: expiresIn
    };
}



module.exports = { issueJWT }