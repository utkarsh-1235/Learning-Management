const {Router} = require('express');
const courseRoute = Router()

const {getAllCourses, getLecturesById} = require('../Controllers/courseController');

courseRoute.get('/', getAllCourses);
courseRoute.get('/:id', getLecturesById);
module.exports = courseRoute;
