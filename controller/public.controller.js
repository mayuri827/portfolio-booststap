
const asyncHandler = require("express-async-handler")
const Projects = require("../model/Projects")


exports.getCarousel = asyncHandler(async (req, res) => {
    const result = await Projects.find()
    res.json({ message: "Fetch carousel success", result })
})

exports.getprojects = asyncHandler(async (req, res) => {
    const result = await Projects.find()
    res.json({ message: "Fetch projects success", result })
})
exports.getProjectDetails = asyncHandler(async (req, res) => {
    const result = await Projects.findById(req.params.id)
    res.json({ message: "Fetch projects Deatils success", result })
})