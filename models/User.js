const mongoose = require('mongoose');



const User = require('../schema/User')

const addRequest = async ({ userId, destination }) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(destination, { $addToSet: { invitations: userId } }, { new: true });

        if (!updatedUser) {
            throw new Error('Failed to send add request');
        }

        // console.log(updatedUser);
    } catch (error) {
        console.error(error);
    }
};

const getAddRequest = async (userId) => {

    let addRequests = await User.findById(userId);
    addRequests = addRequest.invitations
    if (!addRequests) {
        throw new Error('failed to send add request')
    }
    return addRequests

}

const deleteAddRequest = async ({ userId, sender }) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { invitations: sender } }, { new: true });

        if (!updatedUser) {
            throw new Error('Failed to delete add request');
        }

        // console.log(updatedUser);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const addFriend = async({userId,sender})=>{
    const user = await User.findByIdAndUpdate(userId, { $addToSet: { friends: sender } }, { new: true });
    const friend = await User.findByIdAndUpdate(sender, { $addToSet: { friends: userId } }, { new: true });
// console.log('HETTTETETETET',user)
    if (!user || !friend) {
        throw new Error('failed to send add request')
    }

}

const deleteFriend = async ({ userId, friendId })=>{
    const user = await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, { new: true });
    const friend = await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } }, { new: true });
    // console.log('HETTTETETETET',user)
    if (!user || !friend) {
        throw new Error('failed to send add request')
    }

}

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
        // console.log(deletedUser);
    } catch (e) {
        console.log('error while finding a user on the database', e)
        return false;
    }
    return true

}
async function updateUser({ id, password, salt, email, isVerified, username, image }) {
    try {
        let updateObject = {};
        // console.log(id)
        if (password !== undefined) {
            updateObject.password = password;
        }

        if (salt !== undefined) {
            updateObject.salt = salt;
        }

        if (email !== undefined) {
            updateObject.email = email;
        }

        if (username !== undefined) {
            updateObject.username = username;
        }

        if (isVerified !== undefined) {
            updateObject.isVerified = isVerified;
        }

        if (image !== undefined) {
            updateObject.image = image;
        }


        const updatedUser = await User.findByIdAndUpdate(id, { $set: updateObject }, { new: true });
        // console.log(updatedUser);

        return true;
    } catch (error) {
        console.log('Error while updating user on the database', error);
        return false;
    }
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

const getUser = async (userId) => {
    let user;
    try {
        user = await User.findById(userId);

    } catch (e) {
        console.log('error while finding the user on the database', e)
        return false;
    }
    return user;

}

const getUserByEmail = async (email) => {
    let user;
    try {
        user = await User.findOne({ email: email });

    } catch (e) {
        console.log('error while finding the user on the database', e)
        return false;
    }
    return user;

}



module.exports = {
    addNewUser,
    deleteUser,
    updateUser,
    getUsers,
    getUser
    , getUserByEmail,
    addRequest,
    getAddRequest,
    deleteAddRequest,
    addFriend,
    deleteFriend
}