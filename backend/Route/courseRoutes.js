const {Router} = require('express');
const courseRoute = Router();

const {getAllCourses, getLecturesById, createCourse, updateCourse} = require('../Controllers/courseController');
const { isLoggedIn, authorizeSubscriber, authorizedRoles } = require('../Middleware/auth.middleware');
const upload = require('../Middleware/multer.middleware');

courseRoute.route('/')
           .get(getAllCourses)
           .post(isLoggedIn,
                    authorizedRoles('ADMIN'),
                    upload.single('thumbnail'),
                    createCourse);
courseRoute.route('/:id')
           .get(isLoggedIn, authorizeSubscriber, getLecturesById)
           .put(isLoggedIn,
            authorizedRoles('ADMIN'),
            updateCourse)
           .delete()
           .post();


module.exports = courseRoute;
