import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    'name': String,
    'message': String,
    'recieved': Boolean
})

export default mongoose.model('MessageContent', messageSchema);