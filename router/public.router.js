const router = require("express").Router()
const { reteLimit, default: rateLimit } = require("express-rate-limit")
const public = require("./../controller/public.controller")

router

    .get("/get-carousel", rateLimit({ windowMs: 1 * 60 * 1000, limit: 1 }), public.getCarousel)
    .get("/get-projects", public.getprojects)
    .get("/get-projects-details/:id", public.getProjectDetails)


    //enquiey
    .post("/add-enquiry", rateLimit({ windowMs: 15 * 60 * 1000, limit: 1 }), public.addEnquiry)
    .get("/enquiry", public.getEnquiry)
    .put("/update-enquiry/:id", public.updateEnquiry)
    .delete("/delete-enquiry/:id", public.deleteEnquiry)


module.exports = router

