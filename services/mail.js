const mailConfiguation = require('../config/mailConfiguration');
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport(mailConfiguation);
require('dotenv').config();
const jwt = require('jsonwebtoken')
const EMAIL = process.env.EMAIL
const SECRET_KEY = process.env.SECRET_KEY
const sendVerificationEmail =async (userId,email, token) => {
// console.log(email)
    if (!email || !token || !userId ) {
console.log('token or email are empty')
        return false
    }
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'Verify Your Account',
        text:'Hello',
        html: `<p>Click the following link to verify your account: <a href="http://localhost:5000/users/verify/${userId}/${token}">Verify</a></p>`,
    }

   await transporter.sendMail(mailOptions).then(()=>{
    return true
   }).catch(err=>{
    console.log("errorrrorro:;::::",err)
    return false
   })
}



const verifyEmailToken = (token) => {

    jwt.verify(token, SECRET_KEY)
        .then(response => {
            if (!response) {
                return false
            }
            return response
        })
        .catch(err => {
            console.error(err)
            return false
        })


}

module.exports = {
    sendVerificationEmail,
    verifyEmailToken

}