const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const CommentModel = require('../models/Comment');
const commentService = require('./comment-service');
const userService = require('./user-service');
// const sharp = require('sharp');

class PostService {
    async create(wallpaper, title, description, email, comments) {
        const author = await UserModel.findOne({email})
        console.log(author, 'author')
        const post = await PostModel.create({wallpaper, title, description, author, email, comments, user: author})
        return {post};
    }

    async update(_id, wallpaper, title, description) {
        const post = await PostModel.findByIdAndUpdate  (_id, {wallpaper, title, description});
        return {post};
    }

    async delete(id) {
        const post = await PostModel.findByIdAndDelete(id);
        return {post};
    }

    async disablePost(id) {
        const post = await PostModel.findByIdAndUpdate(id, {isDisabled: true}, {new: true});
        return {post};
    }

    async getPostComments(item) {
        item.comments = await CommentModel.find({post: item._id})
        return item
    }

    async getPostComments(post) {
        let {comment} = await commentService.getConfirmedCommentsByPost(post._id)
        return comment
    }

    async getOnePost(id) {
        async function getUser(id) {
            let user = await userService.getUserById(id)
            return {email: user.email, nickname: user.nickname, role: user.role}
        }
        const post = await PostModel.findById(id).populate('author')
        post.comments = await this.getPostComments(post._id)
        await Promise.all(post.comments.map(async (item) => {   
            item.user = await getUser(item.author)
            return item
        }))
        return {post};
    }

    async posts(limit = 0, skip = 0) {
        async function getUser(id) {
            let user = await userService.getUserById(id)
            return {email: user.email, nickname: user.nickname, role: user.role}
        }
        async function getPostComments(id) {
            let {comment} = await commentService.getConfirmedCommentsByPost(id)
            // comment.user = await getUser(comment.author)
            return comment
        }
        
        const posts = await PostModel.find({}).skip(skip).limit(limit).sort({createdAt: -1})

        await Promise.all(posts.map(async (item) => {   
            item.comments = await getPostComments(item._id)
            await Promise.all(item.comments.map(async (item) => {
                item.user = await getUser(item.author)
                return item
            }))
            item.user = await getUser(item.author)
            return item
        }))
        
        return {posts};
    }

    async totalPosts() {
        return await PostModel.countDocuments().exec();
    }

    async viewPost(id) {
        const post = await PostModel.findByIdAndUpdate(id, {$inc: {views: 1}}, {new: true});
    }


        
}

module.exports = new PostService();