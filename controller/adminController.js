const asyncHandler = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const Technology = require("../model/Technology")
const Social = require("../model/Social")
const Carousel = require("../model/Carousel")
const path = require("path")
const { upload, projectUpload } = require("../utils/upload")
const cloudinary = require("../utils/cloudinary.config")
const Projects = require("../model/Projects")

exports.addTechnology = asyncHandler(async (req, res) => {
    const { name, category } = req.body
    const { error, isError } = checkEmpty({ name, category })
    if (isError) {
        return res.status(400).json({ message: "All feild Required", error })
    }
    await Technology.create({ name, category })
    res.json({ message: "Technology create successfully" })
})
exports.getTechnology = asyncHandler(async (req, res) => {
    const result = await Technology.find()
    res.json({ message: "Technology fetch successfully", result })
})
exports.updeteTechnology = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndUpdate(id, req.body)
    res.json({ message: "Technology updete successfully" })
})
exports.deleteTechnology = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndDelete(id)
    res.json({ message: "Technology delete successfully" })
})

//add social

exports.addsocial = asyncHandler(async (req, res) => {
    const { name, link } = req.body
    const { error, isError } = checkEmpty({ name, link })
    if (isError) {
        return res.status(400).json({ message: "All feild Required", error })
    }
    await Social.create({ name, link })
    res.json({ message: "social create successfully" })
})
exports.getsocial = asyncHandler(async (req, res) => {
    const result = await Social.find()
    res.json({ message: "social fetch successfully", result })
})
exports.updetesocial = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Social.findByIdAndUpdate(id, req.body)
    res.json({ message: "social updete successfully" })
})
exports.deletesocial = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Social.findByIdAndDelete(id)
    res.json({ message: "social delete successfully" })
})


//add carousel

exports.addcarousel = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ message: "Upload Error", error: err })
            }
            if (!req.file) {
                return res.status(400).json({ message: "Hero Image Required" })
            }
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            const result = await Carousel.create({ ...req.body, hero: secure_url })
            res.json({ message: "Carousel Add Successfully", result })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error: error.message })

    }
})
exports.getcarousel = asyncHandler(async (req, res) => {
    const result = await Carousel.find()
    res.status(200).json({ message: "carousel fetch successfully", result })
})

exports.updetecarousel = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Multer Error" })
            }
            const { id } = req.params
            if (req.file) {
                //check if the carousel item exists
                const result = await Carousel.findById(id)
                if (!result) {
                    return res.status(404).json({ message: "Carousel Item Not Found" })
                }
                //delete old image from cloudinary
                console.log(result)
                try {
                    await cloudinary.uploader.destroy(path.basename(result.hero))
                } catch (cloudinaryErr) {
                    return res.status(500).json({ message: "Error Deleting image from cloudinary" })
                }

                //upload new image to cloudinary
                let secure_url
                try {
                    const UploadResult = await cloudinary.uploader.upload(req.file.path)
                    secure_url = UploadResult.secure_url

                } catch (uploadErr) {
                    return res.status(json({ message: "Errro uploading image cloudinary" }))
                }

                //updete carousel item with new image url
                await Carousel.findByIdAndUpdate(id, { caption: req.body.caption, hero: secure_url })
            } else {
                //updete carousel item without changing the image
                await Carousel.findByIdAndUpdate(id, { caption: req.body.caption })
            }
            res.json({ message: "Carousel Updete Successfully" })
        })
    } catch (error) {
        res.status(500).json({ message: "Server errro", error: error.message })
    }
})

exports.deletecarousel = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await Carousel.findById(id)
    console.log(result);

    await cloudinary.uploader.destroy(path.basename(result.hero))
    await Carousel.findByIdAndDelete(id)
    res.json({ message: "carousel delete successfully" })
})

exports.addproject = asyncHandler(async (req, res) => {
    projectUpload(req, res, async err => {
        if (err) {
            console.log(err)

            return res.status(400).json({ message: "Multer Error" })
        }
        if (
            !req.files.hero ||
            !req.files["screenshots-web-main"] ||
            !req.files["screenshots-web-other"] ||
            !req.files["screenshots-mobile-main"] ||
            !req.files["screenshots-mobile-other"] ||
            !req.files["sections-web-hero"] ||
            !req.files["sections-mobile-hero"]

        ) {
            return res.status(400).json({ message: "All Images Required" })
        }
        const images = {}
        for (const key in req.files) {
            if (key === "screenshots-web-other" || key === "screenshots-mobile-other") {
                images[key] = []
                const uploadAllImagespromiese = []
                for (const item of req.files[key]) {
                    uploadAllImagespromiese.push(cloudinary.uploader.upload(item.path))
                }
                const allData = await Promise.all(uploadAllImagespromiese)
                images[key] = allData.map(item => item.secure_url)
                // req.files[key].forEach(async item => {
                //     const { secure_url } = await cloudinary.uploader.upload(item.path)
                //     images[key] = [...images[key], secure_url]
                // })

            } else {
                const { secure_url } = await cloudinary.uploader.upload(req.files[key][0].path)
                images[key] = secure_url
            }

        }
        console.log(req.body)
        console.log(images)

        await Projects.create({
            title: req.body.title,
            shortDesc: req.body.shortDesc,
            desc: req.body.desc,
            duration: req.body.duration,
            learning: req.body.learning,
            live: req.body.live,
            source: req.body.source,
            hero: images["hero"],
            isMobileApp: req.body.isMobileApp,
            technologies: {
                frontend: req.body.frontend,
                backend: req.body.backend,
                mobile: req.body.mobile,
                collaboration: req.body.collaboration,
                hosting: req.body.hosting,
            },
            sections: {
                web: [
                    {
                        title: req.body["sections-web-title"],
                        desc: req.body["sections-web-desc"],
                        hero: images["sections-web-images"],
                    }
                ],
                mobile: [
                    {
                        title: req.body["sections-mobile-title"],
                        desc: req.body["sections-mobile-desc"],
                        hero: images["sections-mobile-images"],
                    }
                ],
            },
            screenshots: {
                web: {
                    main: images["screenshots-web-main"],
                    other: images["screenshots-web-other"],
                },
                mobile: {
                    main: images["screenshots-mobile-main"],
                    other: images["screenshots-mobile-other"],
                }
            },

        })


        res.json({ message: "Projects Create Successfully" })

    })
})


exports.getprojects = asyncHandler(async (req, res) => {
    const result = await Projects.find()
    res.json({ message: "projects fetch successfully", result })
})

exports.deleteprojects = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await Projects.findById(id)
    const allImages = []
    allImages.push(cloudinary.uploader.destroy(path.basename(result.hero)))
    for (const item of result.sections.web) {
        if (item.hero) {

            allImages.push(cloudinary.uploader.destroy(path.basename(item.hero)))
        }
    }
    for (const item of result.sections.mobile) {
        if (item.hero) {

            allImages.push(cloudinary.uploader.destroy(path.basename(item.hero)))
        }
    }
    if (result.screenshots.web.main) {

        allImages.push(cloudinary.uploader.destroy(path.basename(result.screenshots.web.main)))
    }
    if (result.screenshots.mobile.main) {
        allImages.push(cloudinary.uploader.destroy(path.basename(result.screenshots.mobile.main)))
    }

    for (const item of result.screenshots.web.other) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item)))
    }
    for (const item of result.screenshots.mobile.other) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item)))
    }
    await Promise.all(allImages)
    await Projects.findByIdAndDelete(id)


    res.json({ message: "projects delete successfully" })
})





