const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
const base64Img = require('base64-img');
// const fs = require('fs');
const { promises: fs } = require("fs");
const path = require('path');
const tokenService = require('../services/token-service');
const { json } = require('body-parser');
const UserModel = require('../models/User');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error validation field', errors.array()));
            }
            const {email, password, nickname} = req.body;
            const userData = await userService.registration(email, password, nickname);
            console.log(`Registration ${email} success`)
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            // res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            console.log(`Login by ${email}`)
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            const user = await userService.activate(activationLink);
            return res.redirect(`${process.env.CLIENT_URL}/#/login`);
        } catch (e) {
            return res.redirect(`${process.env.CLIENT_URL}/404`);
        }
    }

    async refresh(req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization;
            const refreshToken = authorizationHeader.split(' ')[1];
            const userData = await userService.refresh(refreshToken);
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }



    

    async admin(req, res, next) {
        console.log('user controller ADMIN')
        try {
            console.log('admin success')
            return res.status(200).json({message: 'WELCOME TO ADMIN PAGE!'})
        } catch (e) {
            next(e);
        }
    }

    async about(req, res, next) {
        try {
            // const users = await userService.getAllUsers()
            return res.status(200).json({message: 'about page'})
        } catch (e) {
            next(e);
        }
    }

    // async uploadSliderImage(req, res, next){
    //     try {
    //         const {image} = req.body;
    //         // console.log(typeof image, ' image')
    //         base64Img.img(image, 'public/images', Date.now(), function (err, filepath) {
    //             console.log(err, ' err')
    //             console.log(filepath, ' filepath')
    //             const pathArr = filepath.split('/');
    //             const fileName = pathArr[pathArr.length - 1]

    //             return res.status(200).json({
    //                 success: true,
    //                 url: `${process.env.API_URL}/${fileName}`
    //             })

    //         })
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    // async uploadPostImage(req, res, next){
    //     try {
    //         const {image} = req.body;
    //         // console.log(typeof image, ' image')
    //         base64Img.img(image, 'public/posts/images', Date.now(), function (err, filepath) {
    //             // console.log(err, ' err')
    //             console.log(filepath, ' filepath')
    //             const pathArr = filepath.split('/');
    //             const fileName = pathArr[pathArr.length - 1]

    //             return res.status(200).json({
    //                 success: true,
    //                 url: `${process.env.API_URL}/${fileName}`
    //             })

    //         })
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    // async getAllImages(req, res, next) {
    //     try {
    //         async function wrapper() {
    //             try {
    //                 return await fs.readdir('./public/images');
    //             } catch (e) {
    //                 console.log(e, ' e')
    //             }
    //         }
    //         const result = await wrapper();
    //         let arrImages = [];
    //         for(let i = 0; i < result.length; i++) {
    //             arrImages.push(`${process.env.API_URL}/public/images/${result[i]}`)
    //         }

    //         // console.log(arrImages, ' arrImages')
    //         return res.status(200).json({
    //             success: true,
    //             arrImages: arrImages
    //         })
    //     } catch (e) {
    //         next(e)
    //     }


    // }
    // async removeImage(req, res, next) {
    //     try {
    //         const {image} = req.body;
    //         console.log(path.join(__dirname, '..', '/public/images/' + image), ' image');
    //         fs.unlink(path.join(__dirname, '..', '/public/images/' + image), (e) => {
    //             console.log(e, ' error unlink')
    //         });
    //         return res.status(200).json({
    //             success: true
    //         })
    //     } catch (e) {
    //         next(e);
    //     }
    // }


    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users);
            // return res.json(users.map(user => ({email: user.email, role: user.role})))
        } catch (e) {
            next(e);
        }
    }

    async user(req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization;
            const accessToken = authorizationHeader.split(' ')[1];
            const user = tokenService.validateAccessToken(accessToken);
            console.log(user, ' user')
            return res.json(user);
            // return res.json({"email": user.email, "role": user.role, "_id": user._id, "nickname": user.nickname});
        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const {id} = req.params;
            const user = await userService.getUserById(id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const {id} = req.params;
            await userService.deleteUser(id);
            return res.status(200).json({message: 'User deleted'})
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req, res, next) {
        try {
            const {_id, email, role, nickname} = req.body;
            const user = await userService.updateUser(_id, email, role, nickname);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async toggleActiveUser(req, res, next) {
        try {
            const {id} = req.params;
            const user = await userService.toggleActiveUser(id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const {email} = req.body;
            const user = await userService.forgotPassword(email);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async changePassword(req, res, next) {
        try {
            const {password, token} = req.body;
            console.log(password, token, ' password, token')
            const _user = tokenService.validateRefreshToken(token);
            if (!_user) {
                return res.status(403).json({message: 'User not found'})
            }
            const user = await userService.getUserById(_user.id);
            if (!user) {
                return res.status(403).json({message: 'User not found'})
            }
            const result = await userService.changePassword(user, password);
            console.log(result, ' result')
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    // async resetPassword(req, res, next) {
    //     try {
    //         const {email, token} = req.params;
    //         console.log(email, token, ' email, token')
    //         const user = await userService.resetPassword(email, token);
    //         return res.json(user);
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    
            
}

module.exports = new UserController();