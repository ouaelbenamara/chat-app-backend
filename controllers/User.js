const moment = require('moment-timezone');

const { addNewUser,
    deleteUser,
    updateUser,
    getUsers,
    singInUser,
    getUser,
    getUserByEmail
} = require('../models/User')
const {
    addToken,
    getToken
} = require('../models/TokenBlackList')


const { issueJWT } = require('../services/userAuth')
const { sendVerificationEmail,
    verifyEmailToken,

} = require('../services/mail')
const {
    generatePassword,
    validePassword,
    generateToken,
    verifyToken } = require('../lib/utils');
const { response } = require('express');


const usersController = async (req, res) => {
    const respons = await getUsers();
    if (!respons) {
        return res.status(500).send('<h1>error while retreiving users</h1>')
    }
    return res.send(respons)

}

const protectedController = async (req, res) => {
    console.log("success")
    // const userId = req.params.userId
    res.json({ success: true, message: 'you are authorized' })
    // getUser(userId).then(response=>{
    //     if(!response){
    //         return res.status(401).send('you have to verity your account in order to have full access')
    //     }
       

    // })


}

const singleUsersController = (req, res) => {
    const payload = req.body
    const user = singInUser(payload)
    res.send('<h1>single User data</h1>')
}

const registerController = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body)
    if (!username || !email || !password) {
      
        return res.status(400).send("all fields are required",username,email,password)
    }

    const { hash, salt } = await generatePassword(password)


    const user = await addNewUser({ username, email, password: hash, salt })
    if (!user) {
        console.log('errrrrorr')
        return res.status(409).json({success:false,message:'error while creating a new user'})
    }

    // const token = issueJWT(user);
    res.json({user: user})

}


const logInController = async (req, res, next) => {
    const email = req.body.email
    // console.log(req.body)
    await getUserByEmail(email)
        .then(async(user) => {
            if (!user) {
                
                return res.status(401).json({ success: false, message: 'could not find user' })
            }
            const isValide = await validePassword(req.body.password, user.password, user.salt)
            // console.log(isValide)
            if (isValide) {

                if (!user.isVerified) {
                    generateToken(user.email)
                        .then(token => {

                            sendVerificationEmail(user.username,user.email, token)

                        }).catch(err => {
                            console.log('error while generating the token for the email', err)
                            return false
                        })
                }
                const token = issueJWT(user)
                const expirationTime = new Date();
                expirationTime.setMinutes(expirationTime.getMinutes() + 15);
                const USER = {
                  _id:  user._id,
                    email:user.email,
                    username:user.username
                }
                res.cookie('token', token.token, { httpOnly: true, expires: expirationTime })
                res.json({ success: true, user: USER, token: token.token, expiresIn: token.expires, message: user.isVerified ?'verified' : 'go click the link on you email to verify your account'   })
            } else {
                res.status(401).json({ success: false, message: 'you entred the wrong password' })
            }

        }).catch(err => {
            next(err);
        })

}
const logOutController = async (req, res) => {
    const token = req.cookies.token;
    if (typeof token == 'string') {
        await addToken(token);
    }

    res.clearCookie('token');
    res.json({ success: true, message: 'you are now signed out' })


}


const deleteUserController = async (req, res) => {
    const userNameToDelete = req.params.id;
    if (!userNameToDelete) {
        return res.status(500).send("username to delete is required")
    }
    const respons = await deleteUser({ userNameToDelete: userNameToDelete });
    console.log(respons)
    if (!respons) {
        return res.status(500).send("error while deleting user")
    }

    res.send('<h1>user deleted seccussfuly</h1>')
}

const updateUserController = async (req, res) => {
    const userNameToUpdate = req.params.id;
    const { username, email, password } = req.body;
    if (!userNameToUpdate) {
        return res.status(500).send("username to delete is required")
    }
    const respons = await updateUser(userNameToUpdate, password, email);
    console.log(respons)
    if (!respons) {
        return res.status(500).send("error while updating user")
    }

    res.send('<h1>user updated</h1>')
}


const verificationController = async (req, res) => {
    console.log(req.params)
    const userId = req.params.userId;
    const token = req.params.token;

    if (!userId || !token) {
        console.log('all field are required', userId,token)
        return false
    }


    const isValide = verifyToken(token);
    if (!isValide) {
        console.log('invalide email token')
        return false
    }
    const user = await getUser(userId).catch(err=>{
        return res.status(401).send('error while etting the user to verify')
    })
    await updateUser(user.password, user.email, true)
        .then(response => {
            if (!response) {
                return res.status(401).send('user not found')

               
            }
            res.send('<h1>Your account has been verified successfully</h1>')

        }).catch(err => {
            return res.status(401).send('error while updation the user verification', err)

        })




}



module.exports = {
    usersController,
    singleUsersController,
    registerController,
    updateUserController,
    deleteUserController,
    logInController,
    protectedController,
    logOutController,
    verificationController
};