const express = require('express');
const router = express.Router()
// importing controllers
const {
    MessagesController,

    updateMessageController,
    deleteMessageController,
    saveMessageController
} = require('../controllers/Message');
require('../config/authenticationStrategy');
const { authenticate } = require('../config/authenticationStrategy');

////////////////////
router
    // .get('/messages',allMessagesController)
    .post('/save', authenticate, saveMessageController)
    .put('/update/:messageId/:userId', authenticate, updateMessageController)
    .delete('/delete/:messageId/:userId', authenticate, deleteMessageController)
    .get('/:userId/:destination', authenticate, MessagesController)

    .all('/*', (req, res) => {
        res.status(404).send('<h1 style:{{color:\'red\'}}>Error 404 Page not found</h1>')

    })


module.exports = router;