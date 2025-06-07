const express = require('express')
const authController = require('../controllers/authController')
const {protect} = require("../middlewares/authMiddleware");

const uploadImage = require("../middlewares/uploadImage");

const router = express.Router()

router.post("/register", uploadImage.single("image"), authController.register)

router.post("/login", authController.login)

router.get("/get-user", protect, authController.getUserInfo)


module.exports = router;


