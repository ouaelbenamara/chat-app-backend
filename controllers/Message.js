const { addNewMessage,
    deleteMessage,
    updateMessage,
    getMessages,

} = require('../models/Message')


const saveMessageController = async (req, res) => {
    // console.log('body',req.body)
    const { message, sender, destination } = req.body;
    console.log(sender)
    if (!message || !sender || !destination) {
        return res.status(401).send("message and sender and destination are required")

    }
    const response = await addNewMessage({ message, sender:sender,destination: destination.id });
    if (!response) {
        return res.status(500).send('<h1>error while saving a  message </h1>')
    }
    return res.status(200).json({ success: true });
}

const MessagesController = async (req, res) => {
    const userId  = req.params.userId
    const destination = req.params.destination
    console.log(userId,destination)
    const messages = await getMessages({userId:userId,destination:destination});
    
    if (!messages) {
        return res.status(500).json({message:'<h1>error while retreiving Messages</h1>'})
    }else if(messages.length===0){
        return res.status(200).send({messages:[]})

        
    }
    return res.status(200).json({ userId: userId, messages: messages })

}


// const singleMessagesController = (req, res) => {
//     const payload = req.body
//     const Message = singInMessage(payload)
//     res.send('<h1>single Message data</h1>')
// }



const deleteMessageController = async (req, res) => {
    const messageId = req.params.messageId;
    const userId = req.params.userId
    if (!messageId) {
        return res.status(500).send("MessageId to delete is required")
    }
    const respons = await deleteMessage({ messageId, userId });
    // console.log(respons)
    if (!respons) {
        return res.status(401).send("error while deleting Message")
    }

    res.send('<h1>Message deleted seccussfuly</h1>')
}

const updateMessageController = async (req, res) => {
    const messageId = req.params.messageId;
    const newMessage = req.body.message;
    const userId = req.body.userId;
    // console.log( messageId, newMessage)
    if (!messageId || !newMessage) {
        return res.status(500).send("messageId and userId are required to update a message")
    }
    const respons = await updateMessage(messageId, newMessage);
    // console.log(respons)
    if (!respons) {
        return res.status(500).send("error while updating a Message")
    }

    res.send('<h1>Message updated seccussfully</h1>')
}



module.exports = {
    MessagesController,

    updateMessageController,
    deleteMessageController,
    saveMessageController
};