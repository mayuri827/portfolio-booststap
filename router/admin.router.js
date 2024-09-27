const router = require("express").Router()
const admin = require("./../controller/adminController")

router
    .get("/get-tech", admin.getTechnology)
    .post("/add-tech", admin.addTechnology)
    .put("/updete-tech/:id", admin.updeteTechnology)
    .delete("/delete-tech/:id", admin.deleteTechnology)


    //social👇
    .get("/get-social", admin.getsocial)
    .post("/add-social", admin.addsocial)
    .put("/updete-social/:id", admin.updetesocial)
    .delete("/delete-social/:id", admin.deletesocial)

    //carousel👇

    .get("/get-carousel", admin.getcarousel)
    .post("/add-carousel", admin.addcarousel)
    .put("/updete-carousel/:id", admin.updetecarousel)
    .delete("/delete-carousel/:id", admin.deletecarousel)


    .post("/add-project", admin.addproject)
    .get("/get-project", admin.getprojects)
    .delete("/delete-project/:id", admin.deleteprojects)








module.exports = router

