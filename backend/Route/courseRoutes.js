const {Router} = require('express');
const courseRoute = Router();

const {getAllCourses, getLecturesById, createCourse, updateCourse, removeCourse, addLecturesToCoursebyId} = require('../Controllers/courseController');
const { isLoggedIn, authorizeSubscriber, authorizedRoles } = require('../Middleware/auth.middleware');
const upload = require('../Middleware/multer.middleware');

courseRoute.route('/')
           .get(getAllCourses)
           .post(isLoggedIn,
                    authorizedRoles('Educator'),
                    upload.single('thumbnail'),
                    createCourse);
courseRoute.route('/:id')
           .get(isLoggedIn, 
                authorizeSubscriber, 
                getLecturesById)
           .put(isLoggedIn,
                authorizedRoles('Educator'),
                updateCourse)
           .delete(isLoggedIn,
                   authorizedRoles('Educator'),
                   removeCourse
            )
           .post(isLoggedIn,
                 authorizedRoles('Educator'),
                 upload.single('lecture'),
                 addLecturesToCoursebyId
               );


module.exports = courseRoute;
