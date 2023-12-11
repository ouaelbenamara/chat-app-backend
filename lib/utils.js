const bcrypt = require('bcrypt')


const vetifyPassword = () => {

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

const tokenFromCookie = (req)=>{
    let token = null
    // console.log(req)
    if (req && req.cookies) {
        token = req.cookies.token;
    }
    return token;
}


module.exports = {
    generatePassword,
    validePassword,
    tokenFromCookie
}