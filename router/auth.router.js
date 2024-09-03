const router = require("express").Router()
const auth = require("./../controller/auth.controller")

router
    .post("/register", auth.loginUser)
    .post("/register", auth.registerUser)
    .post("/register", auth.LogoutUser)

module.exports = router

