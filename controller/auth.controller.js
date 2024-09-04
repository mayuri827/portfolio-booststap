const asyncHandler = require("express-async-handler")

const bcrypt = require("bcryptjs")
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const { checkEmpty } = require("../utils/checkEmpty")



exports.registerUser = asyncHandler(async (req, res) => {
    const pass = await bcrypt.hash(req.body.password, 10)
    await User.create({ ...req.body, password: pass })
    res.json({ message: "register success" })
})
exports.loginUser = asyncHandler(async (req, res) => {

    //verifly empty 👇
    const { email, password } = req.body
    const { error, isError } = checkEmpty()
    if (isError) {
        return res.status(401).json({ message: "All Feilds Required", error })
    }
    //verifly email 👇
    const result = await User.findOne({ email })
    if (!result) {

        return res.status(401).json({ message: "Invalid Email" })
    }

    //verifly password👇
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {

        return res.status(401).json({ message: "Invalid password" })
    }

    //verifly token 👇
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

    //verifly cookie👇
    res.cookie(token, "user", { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })

    //verifly response 👇
    res.json({
        message: "Login success", result: {
            _id: result._id,
            email: result.email,
            name: result.name
        }
    })
})
exports.LogoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("user")
    res.json({ message: "Logout success" })
})
