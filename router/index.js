const Router = require('express').Router;
const userController = require('../controllers/user-controller.js')
const postController = require('../controllers/post-controller.js')
const commentController = require('../controllers/comment-controller.js')
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware');
const roleMiddleware = require('../middleware/roleMiddleware')

router.post(`/registration`,
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    body('nickname').isLength({min: 3, max: 32}),
    userController.registration);
router.post(`/login`, userController.login);
router.post(`/logout`, userController.logout);
router.get(`/activate/:link`, userController.activate);
router.get(`/refresh`, userController.refresh);
router.get(`/user`, authMiddleware, userController.user);
router.get(`/user/:id`, authMiddleware, roleMiddleware(['ADMIN', 'USER']), userController.getUser);
router.delete(`/user/:id`, authMiddleware, roleMiddleware(['ADMIN']), userController.deleteUser);
router.put(`/user`, authMiddleware, roleMiddleware(['ADMIN']), userController.updateUser);
router.get(`/users`, authMiddleware, roleMiddleware(['ADMIN']), userController.getUsers);
router.put(`/user/:id/toggle-active`, authMiddleware, roleMiddleware(['ADMIN']), userController.toggleActiveUser);
router.post(`/forgot`, userController.forgotPassword);
// router.get(`/reset/:email/:token`, userController.resetPassword);
router.post(`/change-password`, userController.changePassword);


router.get(`/about`, authMiddleware, userController.about);
router.get(`/admin`, authMiddleware, roleMiddleware(['ADMIN']), userController.admin);

router.post(`/post`, authMiddleware, roleMiddleware(['ADMIN']),postController.create);
router.put(`/post`, authMiddleware, roleMiddleware(['ADMIN']),postController.update);
router.delete(`/post`, authMiddleware, roleMiddleware(['ADMIN']),postController.delete);
router.get(`/post/:id`, postController.getOnePost);
router.get(`/allposts`, postController.posts);
router.get(`/posts`, postController.postsByLimit);
router.get(`/posts/total`, postController.totalPosts);
router.get(`/post/:id/view`, postController.viewPost);
router.put(`/post/disable`, authMiddleware, roleMiddleware(['ADMIN']),postController.disablePost);


router.post(`/comment`, authMiddleware, roleMiddleware(['ADMIN', 'USER']),commentController.create);
router.put(`/comment`, authMiddleware, roleMiddleware(['ADMIN']),commentController.update);
router.delete(`/comment`, authMiddleware, roleMiddleware(['ADMIN']),commentController.delete);
router.get(`/comments/:id`, authMiddleware, roleMiddleware(['ADMIN']),commentController.getComments);
router.get(`/comment/:id`, authMiddleware, roleMiddleware(['ADMIN']),commentController.getComment);

// router.get(`/comments`, authMiddleware, roleMiddleware(['ADMIN']),commentController.getComments);
router.get(`/comments`, authMiddleware, roleMiddleware(['ADMIN']),commentController.commentsByLimit);
router.get(`/comments/total`, authMiddleware, roleMiddleware(['ADMIN']),commentController.totalComments);
router.get(`/comments/post/:id`, authMiddleware, roleMiddleware(['ADMIN']),commentController.getConfirmedCommentsByPost);
router.get(`/comments/post/:id/unconfirmed`,authMiddleware, roleMiddleware(['ADMIN']), commentController.getUncorfirmedCommentsByPost);
router.put(`/comment/approve`, authMiddleware, roleMiddleware(['ADMIN']),commentController.approveComment);
router.put(`/comment/reject`, authMiddleware, roleMiddleware(['ADMIN']),commentController.rejectComment);
router.put(`/comment/toggle-approved`, authMiddleware, roleMiddleware(['ADMIN']), commentController.toggleApprovedComment);

module.exports = router;