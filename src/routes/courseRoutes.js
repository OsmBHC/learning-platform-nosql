const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);
router.put('/:id', courseController.modifyCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/stats', courseController.getCourseStats);

module.exports = router;
