const express = require('express');
const router = express.Router()
// importing controllers
const { usersController,
    singleUsersController,
    registerController,
    updateUserController,
    deleteUserController,
    logInController, 
    logOutController,
    verificationController,

    protectedController } = require('../controllers/User');
require('../config/authenticationStrategy');
const { authenticate } = require('../config/authenticationStrategy');

//////////////
router.get('/', usersController)
    .get('/user', singleUsersController)

    .post('/register', registerController)

    .post('/logIn', logInController)
    .get('/protected/:username', authenticate, protectedController)
    .post('/signOut', logOutController)
    .get('/verify/:username/:token',verificationController)
    .put('/update/:id', updateUserController)

    .delete('/delete/:id', deleteUserController)






    .all('/*', (req, res) => {
        res.status(404).send('<h1 style:{{color:\'red\'}}>Error 404 Page not found</h1>')

    })


module.exports = router;