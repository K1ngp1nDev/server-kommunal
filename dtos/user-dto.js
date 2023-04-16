module.exports = class UserDto {
    constructor(model) {
        this.email = model.email;
        this._id = model._id;
        this.isActivated = model.isActivated;
        this.role = model.role;
        this.nickname = model.nickname;
        
    }
}