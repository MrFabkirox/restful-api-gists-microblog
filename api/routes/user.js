const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');

router.post('/signup', UserController.user_signup);

router.post("/login", UserController.user_login)

router.get("/:userId", UserController.user_get_user)

router.get("/", UserController.users_get_all)

router.patch("/:userId", UserController.user_patch)

router.delete("/:userId", checkAuth, UserController.user_delete)

module.exports = router;