const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password, nickname) {
        const candidateEmail = await UserModel.findOne({email})
        if(candidateEmail) {
            throw ApiError.BadRequest(`Email ${email} is already exist`)
        }
        const candidateNickname = await UserModel.findOne({nickname});
        if(candidateNickname) {
            throw ApiError.BadRequest(`Nickname ${nickname} is already exist`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = await uuid.v4();

        const user = await UserModel.create({email, password: hashPassword, activationLink, role: 'USER', nickname})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`);
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }
    

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});
        if(!user) {
            throw ApiError.BadRequest('Incorrect reference activation link')
        }
        user.isActivated = true;
        await user.save();
        return user;
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if(!user) {
            throw ApiError.BadRequest('Unknown user')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password')
        }
        if(!user.isActivated) {
            throw ApiError.BadRequest('User is not activated, check your email')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromBd = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromBd) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens,user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async getUserByToken(refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromBd = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromBd) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id)
        return user;
    }

    async getUserByEmail(author) {
        const user = await UserModel.findOne({ email: author.email })
        return user;
    }

    async getUserById(id) {
        const user = await UserModel.findById(id)
        return user;
    }

    async deleteUser(id) {
        await UserModel.findByIdAndDelete(id)
        return 'User deleted'
    }

    async toggleActiveUser(id) {
        const user = await UserModel.findById(id)
        if(user.isActivated) {
            const updatedUser = await UserModel.findByIdAndUpdate(id, {isActivated: false}, {new: true})
            return updatedUser
        } else {
            const updatedUser = await UserModel.findByIdAndUpdate(id, {isActivated: true}, {new: true})
            return updatedUser
        }
    }

    async updateUser(id, _email, _role, _nickname) {
        const user = await UserModel.findByIdAndUpdate(id, {email: _email, role: _role, nickname: _nickname}, {new: true})
        return user
    }

    async forgotPassword(email) {
        if (!email) {
            throw ApiError.BadRequest('Email is required')
        }
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('User with this email is not found')
        }

        const token = tokenService.generateTokens({id: user.id})
        await tokenService.saveToken(user.id, token.refreshToken)
        
        await mailService.sendResetPasswordMail(email, `${process.env.CLIENT_URL}/#/reset?token=${token.refreshToken}`)
        return 'Check your email'
    }

    async resetPassword(password, token) {
        const result = await tokenService.validateResetToken(token);
        if(!result) {
            throw ApiError.BadRequest('Incorrect token')
        }
        const user = await UserModel.findById(result.id)
        const hashPassword = await bcrypt.hash(password, 3)
        user.password = hashPassword;
        await user.save();
        return user;
    }

    async changePassword(user, password) {
        const hashPassword = await bcrypt.hash(password, 3)
        user.password = hashPassword;
        await user.save();
        return user;
        
    }

}

module.exports = new UserService();