const Token = require('../schema/blackList')


const addToken = async (token) => {

    newToken = new Token({
        token: token
    })
    try {
        await newToken.save()
        return true

    } catch (e) {
        console.log('error while adding an expired token to the blackList', e)
        return false;
    }
}
const getToken = async (token) => {
    try {
        const respons = await Token.findOne({ token: token });
        return respons

    }
    catch (e) {
        console.log('error while finding the blackListed token')
        return false
    }

}
module.exports = {
    getToken,
    addToken
};