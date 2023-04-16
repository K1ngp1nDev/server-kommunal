const {Schema, model} = require('mongoose')

const User = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    role: {type: String, ref: 'Role'},
    createdAt: {type: Date, default: Date.now},
    nickname: {type: String, unique: true, required: true},
})

module.exports = model('User', User)