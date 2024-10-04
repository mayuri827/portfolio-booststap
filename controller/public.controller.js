
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

//

// enquiry

exports.addEnquiry = asyncHandler(async (req, res) => {
    const { name, email, mobile, message, company } = req.body
    const { isError, error } = checkEmpty({ name, email, mobile, message, company })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile" })
    }
    await Enquiry.create({ name, email, mobile, message, company })
    res.json({ message: "Enquery Message Added Success...!", })
})
exports.getEnquiry = asyncHandler(async (req, res) => {
    const result = await Enquiry.find()
    res.json({ message: "Enquiry Fetch Success", result })
})
exports.updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Enquiry.findByIdAndUpdate(id, req.body)
    res.json({ message: "Enquiry Update Success" })
})
exports.deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Enquiry.findByIdAndDelete(id)
    res.json({ message: "Enquiry Delete Success" })
})

