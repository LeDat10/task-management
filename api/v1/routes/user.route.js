const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", controller.register );

router.post("/login", controller.login );

router.post("/password/forgot", controller.forgot );

router.post("/password/otp", controller.otpPassword );

router.post("/password/reset", controller.resetPassword );

router.get("/detail", authMiddleware.requireAuth, controller.detail );

router.get("/list", authMiddleware.requireAuth, controller.listUser );




module.exports = router;