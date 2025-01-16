// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse: Séparer les routes dans différents fichiers permet de structurer le code de manière modulaire, ce qui facilite la maintenance, la réutilisation et la gestion des responsabilités. En séparant les routes, chaque fichier peut se concentrer sur un ensemble spécifique de fonctionnalités, ce qui rend le code plus lisible et plus facile à tester. Cela permet également de gérer les dépendances de manière plus efficace et de faciliter les modifications futures sans affecter d'autres parties de l'application.

// Question : Comment organiser les routes de manière cohérente ?
// Réponse : Organiser les routes de manière cohérente implique de suivre une convention de nommage claire et de structurer les fichiers de manière logique. Par exemple, vous pouvez organiser les routes par entité (comme `courses`, `users`, etc.) et utiliser des sous-dossiers pour les routes spécifiques à chaque entité. Utilisez des noms de fichiers et de fonctions descriptifs pour faciliter la compréhension et la navigation dans le code. Assurez-vous également que les routes sont bien documentées pour que d'autres développeurs puissent comprendre facilement leur fonctionnement.

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
