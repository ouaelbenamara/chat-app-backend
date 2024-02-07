const express = require('express');
const router = express.Router()
// importing controllers
const { getRoomController,
    createRoomController,
    removeUserController,
    addUserController,
    updateRoomController,
    deleteRoomController,
    getRoomsController
} = require('../controllers/Room');
require('../config/authenticationStrategy');
const { authenticate } = require('../config/authenticationStrategy');

////////////////////
router
    .post('/create', authenticate, createRoomController)
    .put('/update/:roomId', authenticate, updateRoomController)
    .put('/addUserToRoom/', authenticate, addUserController)
    .put('/removeUserFromRoom/', authenticate, removeUserController)
    .delete('/delete/:roomId', authenticate, deleteRoomController)
    .get('/:roomId', getRoomController)
    .get('/getRooms/:userId', getRoomsController)
    // .get('/:userId/:destination', authenticate, MessagesController)

    .all('/*', (req, res) => {
        res.status(404).send('<h1 style:{{color:\'red\'}}>Error 404 Page not found</h1>')

    })


module.exports = router;