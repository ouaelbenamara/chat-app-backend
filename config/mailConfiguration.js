require('dotenv').config();
const MAIL_ADDRESS = process.env.EMAIL;
const MAIL_PASSWORD = process.env.E_PASSWORD;



module.exports ={
    service: "gmail",
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: MAIL_ADDRESS ,
        pass: MAIL_PASSWORD,
    },
}