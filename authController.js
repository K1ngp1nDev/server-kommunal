// const User = require('./models/User')
// const Role = require('./models/Role')
// const bcrypt = require('bcryptjs');
// const {validationResult} = require('express-validator');
// const jwt = require('jsonwebtoken');
// const {secret} = require('./config')

// const generateAccessToken = (id, role) => {
//     const payload = {
//         id,
//         role
//     }
//     return jwt.sign(payload, secret, {expiresIn: "1h"})
// }

// class authController {
//     async registration(req, res) {
//         try {
//             const errors = validationResult(req);
//             if(!errors.isEmpty()) {
//                 return res.status(400).json({message: "Ошибка при регистрации", errors})
//             }
//             const {username, password} = req.body;
//             const candidate = await User.findOne({username})
//             if(candidate) {
//                 return res.status(400).json({message: 'Username already ..'})
//             }
//             const hashPassword = bcrypt.hashSync(password, 7);
//             const userRole = await Role.findOne({value: "USER"});
//             const user = new User({username, password: hashPassword, role: [userRole.value]});
//             await user.save();
//             return res.json({message: 'Registration success!'})
//         } catch (e) {
//             console.log(e);
//             res.status(400).json({message: 'Registration failed'})
//         }
//     }

//     async login(req, res) {
//         try {
//             const {username, password} = req.body;
//             const user = await User.findOne({username});
//             if(!user) {
//                 return res.status(400).json({message: `User ${username} not found`})
//             }
//             const validPassword = bcrypt.compareSync(password, user.password);
//             if(!validPassword) {
//                 return res.status(400).json({message: `Wrong password`})
//             }
//             const token = generateAccessToken(user._id, user.role);
//             return res.json({token, user: {
//                     username
//                 }})
//         } catch (e) {
//             console.log(e);
//             res.status(400).json({message: 'Login failed'})
//         }
//     }

//     async getUsers(req, res) {
//         try {
//             const users = await User.find();
//             res.json(users)
//         } catch (e) {
//             console.log(e)
//         }
//     }
// }

module.exports = new authController();