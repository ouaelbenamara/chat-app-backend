// here we find all the interaction whith the database for a given schema
const { default: mongoose } = require('mongoose');
const Message = require('../schema/Message')

const addNewMessage = async ({ sender, message, destination }) => {
    console.log(sender,message,destination)
    let savedMessage;
    const newMessage = new Message({
        sender:sender,
        content: message,
        destination:destination
    });
    try {
        savedMessage = await newMessage.save();

    } catch (e) {
        console.log('error while adding a Message to the database', e)
        return false;
    }
    return savedMessage
}

const deleteMessage = async ({ messageId, userId }) => {

    try {
        const deletedMessage = await Message.deleteOne({ _id: messageId, sender: userId });
        // console.log(deletedMessage);
    } catch (e) {
        console.log('error while deleting a Message on the database', e)
        return false;
    }
    return true

}

const updateMessage = async (messageId, newMessage,userId) => {

    try {
        const updatedMessage = await Message.updateOne({ _id: messageId,sender:userId }, {
            content: newMessage,
        });
        console.log(updatedMessage)

    } catch (e) {
        console.log('error while updating a  Message on the database', e)
        return false;
    }
    return true

}

const getMessages = async ({userId,destination}) => {
    let Messages;
     userId = userId.toString();
     destination = destination.toString();
    try {
         Messages = await Message.find({
            $or: [
                { sender: userId, destination: destination },
                { sender: destination, destination: userId },
            ],
        });
    } catch (e) {
        console.log('error while adding a Message to the database', e)
        return false;
    }
    return Messages;

}

// const getMessage = async (Messagename) => {
//     let Message;
//     try {
//         Message = await Message.findOne({ Messagename: Messagename });

//     } catch (e) {
//         console.log('error while finding the Message on the database', e)
//         return false;
//     }
//     return Message;

// }


module.exports = {
    addNewMessage,
    deleteMessage,
    updateMessage,
    getMessages,
    

}