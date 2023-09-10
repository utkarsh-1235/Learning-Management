const {Router} = require('express');
const courseRoute = Router();

const {getAllCourses, getLecturesById, createCourse} = require('../Controllers/courseController');
const { isLoggedIn, authorizeSubscriber, authorizedRoles } = require('../Middleware/auth.middleware');
const upload = require('../Middleware/multer.middleware');

courseRoute
           //.get(getAllCourses)
           .post('/',
        //    isLoggedIn,
        //          authorizedRoles('ADMIN'),
        //          upload.single('thumbnail'),
                    createCourse);
courseRoute.get('/:id', getLecturesById);


module.exports = courseRoute;
