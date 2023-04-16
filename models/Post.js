const {Schema, model} = require('mongoose')

const Post = new Schema({
    wallpaper: {type: String},
    title: {type: String, required: true},
    description: {type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    comments: {type: Schema.Types.Array, ref: "Comment", default: []},
    views: {type: Number, default: 0},
    user: {type: Schema.Types.Mixed, required: true},
})

module.exports = model('Post', Post)