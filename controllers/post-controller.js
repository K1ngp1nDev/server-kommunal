const postService = require('../services/post-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
// const base64Img = require('base64-img');
// const fs = require('fs');
// const { promises: fs } = require("fs");
// const path = require('path');
// const { base } = require('../models/User');

class PostController {


    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error validation field', errors.array()));
            }
            const {wallpaper, title, description, author, comments} = req.body;

            const response = await postService.create(wallpaper, title, description, author.email, comments);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error validation field', errors.array()));
            }
            const {_id, wallpaper, title, description} = req.body;

            const response = await postService.update(_id, wallpaper, title, description);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error validation field', errors.array()));
            }
            const {id} = req.body;

            const response = await postService.delete(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async disablePost(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error validation field', errors.array()));
            }
            const {id} = req.body;

            const response = await postService.disablePost(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async getOnePost(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error validation field', errors.array()));
            }
            const id = req.params.id
            // console.log(id, ' req.params')

            const response = await postService.getOnePost(id);
            return res.json(response);
        } catch (e) {
            next(e)
        }
    }

    async posts(req, res, next) {
        try {
            const posts = await postService.posts()
            // console.log(posts, 'getPosts')
            return res.json(posts)
        } catch (e) {
            next(e);
        }
    }

    async postsByLimit(req, res, next) {
        try {
            const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
            const skip = parseInt(req.query.skip);// Make sure to parse the skip to number

            const posts = await postService.posts(limit, skip)
            // console.log(posts, 'getPosts')
            return res.json(posts)
        } catch (e) {
            next(e);
        }
    }

    async totalPosts(req, res, next) {
        try {
            const total = await postService.totalPosts()
            // console.log(total, 'total')
            return res.json(total)
        } catch (e) {
            next(e);
        }
    }

    async viewPost(req, res, next) {
        try {
            const id = req.params.id
            const response = await postService.viewPost(id)
            return res.json(response)
        } catch (e) {
            next(e);
        }
    }

    


}

module.exports = new PostController();