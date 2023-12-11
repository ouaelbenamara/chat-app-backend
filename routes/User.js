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
    protectedController } = require('../controllers/User');
require('../config/authenticationStrategy');
const { authenticate } = require('../config/authenticationStrategy');

//////////////
const passport = require('passport');
router.get('/', usersController)
    .get('/user', singleUsersController)

    .post('/register', registerController)

    .post('/logIn', logInController)
    .get('/protected', authenticate, protectedController)
    .post('/signOut', logOutController)

    .put('/update/:id', updateUserController)

    .delete('/delete/:id', deleteUserController)






    .all('/*', (req, res) => {
        res.status(404).send('<h1 style:{{color:\'red\'}}>Error 404 Page not found</h1>')

    })


module.exports = router;