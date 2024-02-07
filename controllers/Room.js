const { getRoom,
    createRoom,
    deleteRoom,
    updateRoom,
    addUser,
    getRooms,
    removeUser } = require('../models/Room')

const getRoomController = async (req, res) => {
    const roomId = req.params.roomId;
    if (!roomId) {
        return res.status(500).json({ success: false, message: 'roomId is required' })
    }

    const room = await getRoom(roomId);
    res.status(200).json({ succes: true, room })




}

const getRoomsController = async (req, res) => {
    const userId = req.params.userId;
    console.log('USER.ID',req.params)
    if (!userId) {
        return res.status(500).json({ success: false, message: 'userId is required' })
    }

    const room = await getRooms(userId);
    res.status(200).json({ succes: true, room })




}
const createRoomController = async (req, res) => {
    const { roomName, people } = req.body;
    // console.log()
    if (!roomName || !people) {
        return res.status(500).json({ success: false, message: 'name and people are required' })
    }

    const room = await createRoom(roomName, people);
    if (!room) {
        res.status(501).json({ succes: false, message: 'error while creating the room' })

    }
    res.status(200).json({ succes: true, room })




}
const deleteRoomController = async (req, res) => {
    const roomId = req.params.roomId;
    if (!roomId) {
        return res.status(500).json({ success: false, message: 'roomId is required' })
    }

    const room = await deleteRoom(roomId);
    if (!room) {
        res.status(501).json({ succes: false, message: 'error while deleting the room' })
    }
    res.status(200).json({ succes: true, room })

}

const updateRoomController = async (req, res) => {
    let room
    const roomId = req.params.roomId
    const { roomName, roomDescription, roomImage } = req.body;
    if (!roomId) {
        return res.status(500).json({ success: false, message: 'roomId is required' })
    }
    if (!roomName && !roomDescription && !roomImage) {
        return res.status(500).json({ success: false, message: 'roomName or  roomDescription or roomImage is required' })
    }

    if (roomName) {
        room = await updateRoom(roomId, roomName);
    } else if (roomDescription) {
        room = await updateRoom(roomId, roomDescription);
    } else {
        room = await updateRoom(roomId, roomImage);
    }



    if (!room) {
        res.status(501).json({ succes: false, message: 'error while updating the room' })

    }
    res.status(200).json({ succes: true, room })
}



const addUserController = async (req, res) => {
    const { usersId, roomId } = req.body;
    if (!roomId || usersId.length===0) {
        return res.status(500).json({ success: false, message: 'userId and roomId are required' })
    }

    const room = await addUser(usersId, roomId);
    if (!room) {
        res.status(501).json({ succes: false, message: 'error while adding the user to  the room' })

    }
    res.status(200).json({ succes: true, room })

}


const removeUserController = async (req, res) => {
    const { userId, roomId } = req.body;
    if (!roomId || !userId) {
        return res.status(500).json({ success: false, message: 'userId and roomId are required' })
    }

    const room = await removeUser(userId, roomId);
    if (!room) {
        res.status(501).json({ succes: false, message: 'error while removing the user from  the room' })

    }
    res.status(200).json({ succes: true, room })




}

module.exports = {
    getRoomController,
    createRoomController,
    removeUserController,
    addUserController,
    updateRoomController,
    deleteRoomController,
    getRoomsController
}