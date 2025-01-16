// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Un contrôleur est responsable de la logique métier et de la gestion des requêtes HTTP, tandis qu'une route est responsable de la définition des points de terminaison (endpoints) de l'API et de la redirection des requêtes vers les contrôleurs appropriés. En d'autres termes, les routes définissent les URL et les méthodes HTTP que l'API accepte, et les contrôleurs contiennent la logique pour traiter ces requêtes.

// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Séparer la logique métier des routes permet de structurer le code de manière modulaire, ce qui facilite la maintenance, la réutilisation et la gestion des responsabilités. En séparant les contrôleurs des routes, chaque module peut se concentrer sur une tâche spécifique, ce qui rend le code plus lisible et plus facile à tester. Cela permet également de gérer les dépendances de manière plus efficace et de faciliter les modifications futures sans affecter d'autres parties de l'application.

const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const mongoService = require("../services/mongoService");
const redisService = require("../services/redisService");

const CACHE_KEYS = {
  ALL_COURSES: process.env.REDIS_KEY_ALL_COURSES || "course:all",
  COURSE_PREFIX: process.env.REDIS_KEY_COURSE_PREFIX || "course:",
  STATS: process.env.REDIS_KEY_COURSE_STATS || "stats:courses",
};

// Create a new course
async function createCourse(req, res) {
  try {
    const { title, description, category, startDate, endDate, instructor } = req.body;

    if (!title || !description || !category || !instructor || !startDate || !endDate) {
      return res.status(400).json({
        error: "Please provide title, description, category, instructor, startDate, and endDate.",
      });
    }

    const newCourse = await mongoService.createDocument(
      getDb().collection("courses"),
      {
        title,
        description,
        category,
        instructor,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
        updatedAt: null,
      }
    );

    // Invalidate all courses and stats cache
    await redisService.deleteCachedData(CACHE_KEYS.ALL_COURSES);
    await redisService.deleteCachedData(CACHE_KEYS.STATS);

    res.status(201).json({ message: "Course created successfully.", data: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Retrieve all courses
async function getAllCourses(req, res) {
  try {
    const cachedCourses = await redisService.getCachedData(CACHE_KEYS.ALL_COURSES);
    // check if cached data exists
    if (cachedCourses) {
      return res.status(200).json({
        message: "Courses retrieved successfully from cache.",
        count: JSON.parse(cachedCourses).length,
        data: JSON.parse(cachedCourses),
      });
    }

    const courses = await mongoService.findAll(getDb().collection("courses"));

    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found." });
    }

    // Cache all courses
    await redisService.cacheData(CACHE_KEYS.ALL_COURSES, JSON.stringify(courses));

    res.status(200).json({
      message: "Courses retrieved successfully.",
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Retrieve a course by ID
async function getCourse(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID." });
    }

    const cacheKey = `${CACHE_KEYS.COURSE_PREFIX}${id}`;
    const cachedCourse = await redisService.getCachedData(cacheKey);

    // Check if cached data exists
    if (cachedCourse) {
      return res.status(200).json({
        message: "Course retrieved successfully from cache.",
        data: JSON.parse(cachedCourse),
      });
    }

    const course = await mongoService.findOneById(getDb().collection("courses"), id);

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    // Cache the course
    await redisService.cacheData(cacheKey, JSON.stringify(course));

    res.status(200).json({ message: "Course retrieved successfully.", data: course });
  } catch (error) {
    console.error("Error retrieving course by ID:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Modify a course
async function modifyCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, instructor, startDate, endDate } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID." });
    }

    const course = await mongoService.findOneById(getDb().collection("courses"), id);

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    const update = {
      title,
      description,
      category,
      instructor,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      updatedAt: new Date(),
    };

    const updatedCourse = await mongoService.updateDocument(getDb().collection("courses"), id, update);

    // Update individual course cache
    const cacheKey = `${CACHE_KEYS.COURSE_PREFIX}${id}`;
    await redisService.cacheData(cacheKey, JSON.stringify(updatedCourse));

    // Invalidate all courses and stats cache
    await redisService.deleteCachedData(CACHE_KEYS.ALL_COURSES);
    await redisService.deleteCachedData(CACHE_KEYS.STATS);

    res.status(200).json({ message: "Course updated successfully.", data: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Delete a course
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID." });
    }

    const course = await mongoService.findOneById(getDb().collection("courses"), id);

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    await mongoService.deleteDocument(getDb().collection("courses"), id);

    // Remove individual course cache
    const cacheKey = `${CACHE_KEYS.COURSE_PREFIX}${id}`;
    await redisService.deleteCachedData(cacheKey);

    // Invalidate all courses and stats cache
    await redisService.deleteCachedData(CACHE_KEYS.ALL_COURSES);
    await redisService.deleteCachedData(CACHE_KEYS.STATS);

    res.status(200).json({ message: "Course deleted successfully." });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

// Retrieve course statistics
async function getCourseStats(req, res) {
  try {
    const cachedStats = await redisService.getCachedData(CACHE_KEYS.STATS);
    // Check if cached data exists
    if (cachedStats) {
      return res.status(200).json({
        message: "Course statistics retrieved successfully from cache.",
        data: JSON.parse(cachedStats),
      });
    }

    const courses = await mongoService.findAll(getDb().collection("courses"));

    if (courses.length === 0) {
      return res.status(404).json({ error: "No courses found." });
    }

    const stats = {
      totalCourses: courses.length,
      totalCategories: new Set(courses.map((course) => course.category)).size,
      totalInstructors: new Set(courses.map((course) => course.instructor)).size,
    };

    // Cache the stats
    await redisService.cacheData(CACHE_KEYS.STATS, JSON.stringify(stats));

    res.status(200).json({ message: "Course statistics retrieved successfully.", data: stats });
  } catch (error) {
    console.error("Error retrieving course statistics:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
}

module.exports = {
  createCourse,
  getCourse,
  getAllCourses,
  modifyCourse,
  deleteCourse,
  getCourseStats,
};
