const commentService = require('../services/comment-service');

class CommentController {
    async create(req, res, next) {
        try {
            async function authorEmail() {
                const author = req.body.author;
                const email = author.email;
                return email;
            }
            // async function getPostTitle() {
            //     const post = req.body.postId;
            //     const title = post.title;
            //     return title;
            // }
            const email = await authorEmail();
            // const postTitle = await getPostTitle();
            const {postId, author, text, postTitle} = req.body;
            console.log(author, 'author')
            const response = await commentService.create(postId, author, text, author.email, postTitle);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.body;
            const response = await commentService.delete(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const {_id, text} = req.body;
            const response = await commentService.update(_id, text);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getComments(req, res, next) {
        try {
            const response = await commentService.getComments();
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async commentsByLimit(req, res, next) {
        try {
            const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
            const skip = parseInt(req.query.skip);// Make sure to parse the skip to number
            
            const {comments} = await commentService.commentsByLimit(limit, skip);
            // console.log(comments, 'comments')
            return res.json(comments);
        } catch (e) {
            next(e)
        }
    }

    async getComment(req, res, next) {
        try {
            const id = req.params.id    
            const response = await commentService.getComment(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getAllCommentsByPost(req, res, next) {
        try {
            const id = req.params.id
            const response = await commentService.getAllCommentsByPost(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }



    async getConfirmedCommentsByPost(req, res, next) {
        try {
            const id = req.params.id
            const response = await commentService.getConfirmedCommentsByPost(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getUncorfirmedCommentsByPost(req, res, next) {
        try {
            const id = req.params.id
            const response = await commentService.getUncorfirmedCommentsByPost(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async toggleApprovedComment(req, res, next) {
        try {
            const {id} = req.body;
            const response = await commentService.toggleApprovedComment(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async approveComment(req, res, next) {
        try {
            const {id} = req.body;
            console.log(id, 'id')
            const response = await commentService.approveComment(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async rejectComment(req, res, next) {
        try {
            const {id} = req.body;
            const response = await commentService.rejectComment(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async totalComments(req, res, next) {
        try {
            const response = await commentService.totalComments();
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    // async getCommentsByUser(req, res, next) {
    //     try {
    //         const id = req.params.id
    //         const response = await commentService.getCommentsByUser(id);
    //         return res.json(response);
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    // async getCommentsByPost(req, res, next) {
    //     try {
    //         const id = req.params.id
    //         const response = await commentService.getCommentsByPost(id);
    //         return res.json(response);
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    

    

}

module.exports = new CommentController();