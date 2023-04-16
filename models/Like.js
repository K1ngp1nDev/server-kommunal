const {Schema, model} = require('mongoose')

const Like = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    post: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    comment: {type: Schema.Types.ObjectId, ref: "Comment"},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
})

module.exports = model('Like', Like)