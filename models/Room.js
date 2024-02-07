const { default: mongoose } = require('mongoose')
const Room = require('../schema/room')


const getRoom = async (roomId) => {


    const response = await Room.findById(roomId)
    if (!response) {
        throw new Error('failed to fetch room')
    }
    else {
        return response

    }

}
const getRooms = async (userId) => {
    try {
        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log(userId)
            throw new Error('Invalid userId', userId);
        }

        // Convert userId to ObjectId
        const objectIdUserId = new mongoose.Types.ObjectId(userId);

        // Find rooms where the userId exists in the people array
        console.log('userId: ', objectIdUserId);
        const response = await Room.find({ people: { $in: [objectIdUserId] } });
        console.log(response)
        if (!response) {
            throw new Error('Failed to fetch rooms');
        } else {
            return response;
        }
    } catch (error) {
        console.error('Error while fetching rooms:', error);
        return false;
    }
};

const createRoom = async (roomName, people) => {

    const newRoom = new Room({
        roomName: roomName,
        people
    })

    try {
        savedRoom = await newRoom.save()

        return savedRoom
    } catch (error) {
        console.log('error whil saving the room')
        return false
    }
}

const deleteRoom = async (roomId) => {
    try {
        const res = await Room.findByIdAndDelete(roomId)
        return res
    }

    catch (error) {
        console.log('error whil deleting the room')
        return false
    }
}
const updateRoom = async (roomId, roomName = false, roomImage = false, roomDescription = false) => {
    let objectToUpdate
    if (!roomId) {
        console.log('roomId is  required')
        return false
    }
    if (!roomName && !roomImage, !roomDescription) {
        console.log('all fields are empty')
        return false

    }
    if (roomName) {
        objectToUpdate = {
            roomName
        }
    } else if (roomImage) {
        objectToUpdate = {
            roomImage
        }

    }
    else {
        objectToUpdate = {
            roomDescription
        }

    }

    try {
        const res = await Room.findByIdAndUpdate(roomId, objectToUpdate)
        return res
    }

    catch (error) {
        console.log('error whil updating the room')
        return false
    }

}
const addUser = (usersId, roomId) => {


    if (!usersId.length === 0 || !roomId) {
        console.log('userId and roomId are required')
        return false
    }

    try {
        const res = Room.findByIdAndUpdate(roomId, { $addToSet: { people: { $each: usersId } } }
            , { new: true })
        return res
    } catch (error) {
        console.log('error while adding the user to the room', error)
        return false
    }
}
const removeUser = (userId, roomId) => {


    if (!userId || !roomId) {
        console.log('userId and roomId are required')
        return false
    }

    try {
        const res = Room.findByIdAndUpdate(roomId, { $pull: { people: userId } }, { new: true })
        return res
    } catch (error) {
        console.log('error while removing the user from the room', error)
        return false
    }
}




module.exports = {
    getRoom,
    createRoom,
    deleteRoom,
    updateRoom,
    addUser,
    removeUser,
    getRooms
}