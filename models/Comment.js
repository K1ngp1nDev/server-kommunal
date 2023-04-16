const {Schema, model} = require('mongoose')

const Comment = new Schema({
    text: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    email: {type: String, required: true},
    post: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    postTitle: {type: String, required: true},
    isConfirmed: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    user: {type: Schema.Types.Mixed, required: true},
})

module.exports = model('Comment', Comment)