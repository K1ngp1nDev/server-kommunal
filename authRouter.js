// const Router = require('express');
// const router = new Router();
// const authController = require('./authController');
// const {check} = require('express-validator');
// const authMiddleware = require('./middleware/authMiddleware');
// const roleMiddleware = require('./middleware/roleMiddleware');
//
// router.post(`/registration`,[
//         check('username', "username can't be empty").notEmpty(),
//         check('password', 'length must be under 6 symbols').isLength({min: 6})
//     ],
//     authController.registration);
// router.post(`/login`,authController.login);
// router.get('/users', roleMiddleware(['ADMIN']), authController.getUsers);
// router.get('/', authController.getUsers);
//
// module.exports = router;