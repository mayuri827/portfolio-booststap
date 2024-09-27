
const jwt = require("jsonwebtoken")
exports.adminProtected = (req, res, next) => {
    const { user } = req.cookies
    if (!user) {
        return res.status(401).json({ mesage: "No cookie Found" })
    }
    jwt.verify(user, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error)

            return res.status(401).json({ message: "invalid token" })
        }
        req.user = decode.userId
        next()
    })
}