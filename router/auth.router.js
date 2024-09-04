const router = require("express").Router()
const auth = require("./../controller/auth.controller")

router
    .post("/login", auth.loginUser)
    .post("/register", auth.registerUser)
    .post("/logout", auth.LogoutUser)

module.exports = router

