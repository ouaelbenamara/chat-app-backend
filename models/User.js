const mongoose = require('mongoose');



const User = require('../schema/User')

const addNewUser = async ({ username, email, password, salt }) => {
    let savedUser;
    const newUser = new User({
        username: username,
        email: email,
        password: password,
        salt: salt,
    });
    try {
        savedUser = await newUser.save();

    } catch (e) {
        console.log('error while adding a user to the database', e)
        return false;
    }
    return savedUser
}


const deleteUser = async ({ userNameToDelete }) => {

    try {
        const deletedUser = await User.deleteOne({ username: userNameToDelete });
        console.log(deletedUser);
    } catch (e) {
        console.log('error while finding a user on the database', e)
        return false;
    }
    return true

}

const updateUser = async ( userNameToUpdate, password, email,isVerified=false ) => {

    try {
        const updatedUser = await User.updateOne({ username: userNameToUpdate }, {
            username: userNameToUpdate,
            password,
            email,
            isVerified: (isVerified) ? true : false
        });

    } catch (e) {
        console.log('error while updating user on the database', e)
        return false;
    }
    return true

}

const getUsers = async () => {
    let users;
    try {
        users = await User.find();

    } catch (e) {
        console.log('error while adding a user to the database', e)
        return false;
    }
    return users;

}

const getUser = async (username) => {
    let user;
    try {
        user = await User.findOne({ username: username });

    } catch (e) {
        console.log('error while finding the user on the database', e)
        return false;
    }
    return user;

}

const singInUser = async ({ email, password, username }) => {
    let user;
    try {
        user = await User.findOne({ email: emailToFind });
        if (!user) {
            return false;
        }



    } catch (e) {
        console.log('error while finding the user', e)
        return false;
    }
    return user;

}


module.exports = {
    addNewUser,
    deleteUser,
    updateUser,
    getUsers,
    singInUser,
    getUser

}