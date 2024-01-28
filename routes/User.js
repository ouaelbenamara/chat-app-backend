const express = require('express');
const router = express.Router()
// importing controllers
const { usersController,
    singleUserController,
    registerController,
    updateUserController,
    deleteUserController,
    logInController, 
    logOutController,
    verificationController,
    addRequestController,
    acceptAddRequestController,
    removeFriendController,

    protectedController, 
    getAddRequestController} = require('../controllers/User');
require('../config/authenticationStrategy');
const { authenticate } = require('../config/authenticationStrategy');

//////////////
router.get('/', usersController)
    .get('/user/:userId', singleUserController)
    // .post('/user/:userId/editPassword', editPasswordController)

    .post('/register', registerController)

    .post('/logIn', logInController)
    .get('/protected', authenticate, protectedController)
    .post('/signOut', logOutController)
    .get('/verify/:userId/:token',verificationController)
    .put('/update/:userId', updateUserController)
.post('/addRequest',addRequestController)
.post('/addRequest/:userId',getAddRequestController)
    .put('/removeFriend/:userId',removeFriendController)
    .post('/addRequest/accept/:userId',acceptAddRequestController)
    .delete('/delete/:id', deleteUserController)






    .all('/*', (req, res) => {
        res.status(404).json({success:false,message:'page not found'})

    })


module.exports = router;