const router = require("express").Router()
const public = require("./../controller/public.controller")

router
    .get("/get-carousel", public.getCarousel)
    .get("/get-projects", public.getprojects)
    .get("/get-projects-details/:id", public.getProjectDetails)


module.exports = router

