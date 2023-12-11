const moment = require('moment-timezone');

const { addNewUser,
    deleteUser,
    updateUser,
    getUsers,
    singInUser,
    getUser
} = require('../models/User')
const {
    addToken,
    getToken
} = require('../models/TokenBlackList')


const { issueJWT } = require('../services/userAuth')
const {
    generatePassword,
    validePassword } = require('../lib/utils')


const usersController = async (req, res) => {
    const respons = await getUsers();
    if (!respons) {
        return res.status(500).send('<h1>error while retreiving users</h1>')
    }
    return res.send(respons)

}

const protectedController = async (req, res) => {



    res.json({ success: true, message: 'you are authorized' })

}

const singleUsersController = (req, res) => {
    const payload = req.body
    const user = singInUser(payload)
    res.send('<h1>single User data</h1>')
}

const registerController = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(500).send("all fields are required")
    }

    const { hash, salt } = await generatePassword(password)


    const user = await addNewUser({ username, email, password: hash, salt })
    if (!user) {
        return res.status(500).send("error while creating a new user")
    }
    const token = issueJWT(user);
    res.json({ success: true, user: user, token: token.token, expiresIn: token.expires })

}


const logInController = async (req, res, next) => {
    await getUser(req.body.username)
        .then((user) => {
            if (!user) {
                return res.status(401).json({ success: false, message: 'could not find user' })
            }
            const isValide = validePassword(req.body.password, user.hash, user.salt)
            if (isValide) {

                const token = issueJWT(user)
                const expirationTime = new Date();
                expirationTime.setMinutes(expirationTime.getMinutes() + 15);
                res.cookie('token', token.token, { httpOnly: true, expires: expirationTime })
                res.json({ success: true, user: user, token: token.token, expiresIn: token.expires })
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
    const respons = await updateUser({ userNameToUpdate, password, email });
    console.log(respons)
    if (!respons) {
        return res.status(500).send("error while updating user")
    }

    res.send('<h1>user updated</h1>')
}



module.exports = {
    usersController,
    singleUsersController,
    registerController,
    updateUserController,
    deleteUserController,
    logInController,
    protectedController,
    logOutController
};