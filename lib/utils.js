const bcrypt = require('bcrypt')
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY
const jwt = require('jsonwebtoken');

const generateToken = async(email) => {
    let token;
    const payload = {
        email:email,
        iot:new Date()
    }
    try {
        token = await jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })


    } catch (err) {
        console.error('error while creating a token', err)
        return false
    }

    return token;
}

const generatePassword = async (password) => {
    const slatRound = 10;
    const salt = await bcrypt.genSalt(slatRound)
    const hash = await bcrypt.hash(password, salt)
    return { salt, hash };
}

const validePassword = async (password, hash, salt) => {
    const Hash = await bcrypt.hash(password, salt)

    return hash === Hash;
}

const tokenFromCookie = (req) => {
    let token = null
    // console.log(req)
    if (req && req.cookies) {
        token = req.cookies.token;
    }
    return token;
}
const verifyToken =async (token)=>{
    return await jwt.verify(token,SECRET_KEY)
}

module.exports = {
    generatePassword,
    validePassword,
    tokenFromCookie,
    generateToken, verifyToken
}