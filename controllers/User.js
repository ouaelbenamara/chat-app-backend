const moment = require('moment-timezone');

const { addNewUser, deleteUser, updateUser, getUsers, getUser, getUserByEmail, addRequest, deleteFriend,getAddRequest, deleteAddRequest, addFriend } = require('../models/User');

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
    verifyToken,
    tokenFromCookie } = require('../lib/utils');
const { response } = require('express');


const usersController = async (req, res) => {
    let respons = await getUsers();
    respons = respons.map(user => ({ _id: user._id, email: user.email, username: user.username ,image:user.image}))
    if (!respons) {
        return res.status(500).send('<h1>error while retreiving users</h1>')
    }
    return res.status(200).json(respons);
}

const protectedController = async (req, res) => {
    // console.log("success")
    // const userId = req.params.userId
    res.json({ success: true, message: 'you are authorized' })
    // getUser(userId).then(response=>{
    //     if(!response){
    //         return res.status(401).send('you have to verity your account in order to have full access')
    //     }


    // })


}

const singleUserController = async (req, res) => {
    const userId = req.params.userId

    const user = await getUser(userId)
// console.log(userId)
    const USER = {
        _id: user._id,
        email: user.email,
        username: user.username,
        image: user.image,
        friends: user.friends,
        invitations: user.invitations
}
// console.log(USER)
    res.status(200).json( USER )
}

const registerController = async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(req.body)
    if (!username || !email || !password) {

        return res.status(400).send("all fields are required", username, email, password)
    }

    const { hash, salt } = await generatePassword(password)


    const user = await addNewUser({ username, email, password: hash, salt })
    if (!user) {
        // console.log('errrrrorr')
        return res.status(409).json({ success: false, message: 'error while creating a new user' })
    }

    // const token = issueJWT(user);
    res.json({ user: user })

}
const addRequestController = (req,res)=>{
    const { sender,destination} = req.body
    // console.log(req.body)
    if(!sender||!destination){
        return res.status(500).json({success:false , message:'destination and sender ar erequired'})

    }
    // add the destination addresquest table to the id of the sender 
    try{
        addRequest({ userId: sender, destination })
        res.status(200).json({ success: false, message: 'add Request was  sent successfully' })


    }catch(err){
        console.error(err)
    }





}

const getAddRequestController = async(req,res)=>{
    const userId = req.params.userId
    // console.log(req.body)
    if(!userId){
        return res.status(500).json({success:false , message:'userId is erequired'})

    }

    try{
       const addRequests = await getAddRequest(userId)
        res.status(200).json({ success: true, addRequests })


    }catch(err){
        console.error(err)
    }





}

const acceptAddRequestController = async(req,res)=>{
    const userId = req.params.userId;
    const sender = req.body.sender
    if (!userId || !sender){
        return res.status(500).json({success:false,message:'userId and sender are required'})
    }
    try{
        await deleteAddRequest({ userId, sender })
        // await addFriend({userId,sender})
        await addFriend({sender,userId})
        console.log('success')
        res.status(200).json({success:true,message:'add request accepted'})

    }
   catch(err){
    console.log('Error',err)
    res.status(501).json({success:false,message:'RRRRRR',err})
   }



}
const removeFriendController = async(req,res)=>{
    const userId = req.params.userId;
    const friendId = req.body.friendId
    // console.log('frieeie')
    if (!userId || !friendId){
        return res.status(500).json({ success: false, message:'userId and friendId are required'})
    }
    try{
        await deleteFriend({ userId, friendId })
        // await addFriend({userId,sender})
        res.status(200).json({success:true,message:'freind deleted successfully'})

    }
   catch(err){
    console.log('Error',err)
    res.status(501).json({success:false,message:'RRRRRR',err})
   }



}

const logInController = async (req, res, next) => {
    const email = req.body.email
    console.log(req.body)
    await getUserByEmail(email)
        .then(async (user) => {
            if (!user) {

                return res.status(401).json({ success: false, message: 'could not find user' })
            }
            const isValide = await validePassword(req.body.password, user.password, user.salt)
            // console.log(isValide)
            if (isValide) {

                if (!user.isVerified) {
                    generateToken(user.email)
                        .then(token => {

                            sendVerificationEmail(user._id, user.email, token)

                        }).catch(err => {
                            console.log('error while generating the token for the email', err)
                            return false
                        })
                }
                const token = issueJWT(user)
                const expirationTime = new Date();
                expirationTime.setMinutes(expirationTime.getMinutes() + 15);
                const USER = {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    image:user.image,
                    friends:user.friends,
                    invitations:user.invitations
                }
                res.cookie('token', token.token, { httpOnly: true, expires: expirationTime })
                res.json({ success: true, user: USER, token: token.token, expiresIn: token.expires, message: user.isVerified ? 'verified' : 'go click the link on you email to verify your account' })
            } else {
                res.status(401).json({ success: false, message: 'you entred the wrong password' })
            }

        }).catch(err => {
            next(err);
        })

}
const logOutController = async (req, res) => {
    const token = tokenFromCookie(req);
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
    // console.log(respons)
    if (!respons) {
        return res.status(500).send("error while deleting user")
    }

    res.send('<h1>user deleted seccussfuly</h1>')
}

const updateUserController = async (req, res) => {
    let respons
    const userId = req.params.userId;
    const { username, email, password,image } = req.body;
    console.log(req.body)
    if (!userId) {
        return res.status(500).send("userId to delete is required")
    }
    if(password){
        const { hash, salt } = await generatePassword(password)
        // console.log(hash, salt)
         respons = await updateUser({password:hash, salt, id:userId});
    }else if(username){
        respons = await updateUser({ id:userId, username });

    } else if (image) {
        respons = await updateUser({ id:userId, image });


    }
    // console.log(respons)
    if (!respons) {
        return res.status(500).json({success:false,message:"error while updating user"})
    }
// console.log(respons)
    res.status(200).json({success:true,message:'user updated successfully'})
}


const verificationController = async (req, res) => {
    // console.log(req.params)
    const userId = req.params.userId;
    const token = req.params.token;

    if (!userId || !token) {
        console.log('all field are required', userId, token)
        return res.satatus(500).json({success:false,message:'all fiels are required'})
    }


    const isValide = verifyToken(token);
    if (!isValide) {
        console.log('invalide email token')
        return res.satatus(505).json({ success: false, message: 'invalide email token' })

    }
    const user = await getUser(userId).catch(err => {
        return res.status(401).send('error while etting the user to verify')
    })
    await updateUser({ id: user._id, isVerified: true})
        .then(response => {
            if (!response) {
                return res.status(401).send('user not found')


            }
            console
            res.send('<h1>Your account has been verified successfully</h1>')

        }).catch(err => {
            return res.status(401).send('error while updation the user verification', err)

        })




}



module.exports = {
    usersController,
    singleUserController,
    registerController,
    updateUserController,
    deleteUserController,
    logInController,
    protectedController,
    logOutController,
    verificationController,
    addRequestController,
    getAddRequestController,
    acceptAddRequestController,
    removeFriendController
};