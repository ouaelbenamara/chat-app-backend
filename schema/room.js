const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    // id:{type:String,required:true,unique:true},
    roomName:{type:String,required:true},
    people: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    roomDescription:{type:String},
    roomImage: { type: String, default: false }
})


const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
