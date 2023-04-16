const Comment = require('../models/Comment');
const UserService = require('./user-service');

class CommentService {
    async create(post, _author, text, email, postTitle) {
        const author = await UserService.getUserByEmail(_author)
        const comment = await Comment.create({text, author, post, email, postTitle, user: author});
        return {comment};
    }

    async delete(id) {
        const comment = await Comment.findByIdAndDelete(id);
        return {comment};
    }

    async update(id, text) {
        const comment = await Comment.findByIdAndUpdate(id, {text}, {new: true});
        return {comment};
    }

    async getComments(id) {
        const comment = await Comment.find()
        return {comment};
    }

    async getComment(id) {
        const comment = await Comment.findById(id)
        return {comment};
    }

    async getAllCommentsByPost(id) {
        const comments = await Comment.find({post: id})
        return {comments};
    }

    async getConfirmedComments() {
        const comments = await Comment.find({isConfirmed: true}) 
        return {comments};
    }

    async getUnconfirmedComments() {
        const comment = await Comment.find({isConfirmed: false})
        return {comment};
    }

    async toggleApprovedComment(id) {
        const comment = await Comment.findById(id)  
        if (comment.isConfirmed) {
            const comment = await Comment.findByIdAndUpdate(id, {isConfirmed: false}, {new: true});
            return {comment};
        } else {
            const comment = await Comment.findByIdAndUpdate(id, {isConfirmed: true}, {new: true});
            return {comment};
        }
    }

    async approveComment(id) {
        console.log(id, ' id')
        const comment = await Comment.findByIdAndUpdate(id, {isConfirmed: true}, {new: true});
        console.log(comment, ' comment')
        return {comment};
    }

    async rejectComment(id) {
        const comment = await Comment.findByIdAndUpdate(id, {isConfirmed: false}, {new: true});
        return {comment};
    }

    async totalComments() {
        return await Comment.countDocuments().exec();
    }

    async getUncorfirmedCommentsByUser(id) {
        const comment = await Comment.find({author: id, isConfirmed: false})
        return {comment};
    }

    async getUncorfirmedCommentsByPost(id) {
        const comment = await Comment.find({post: id, isConfirmed: false})
        return {comment};
    }

    async getConfirmedCommentsByPost(id) {
        
        const comment = await Comment.find({post: id, isConfirmed: true})
        return {comment};
    }
    async commentsByLimit(limit = 0, skip = 0) {
        const comments = await Comment.find().limit(limit).skip(skip)
        return {comments};
    }
    
}

module.exports = new CommentService();