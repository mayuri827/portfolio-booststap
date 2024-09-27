const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { adminProtected } = require("./middlewares/protected")
require("dotenv").config()

const app = express()

//middleware
app.use(express.json())
app.use(express.static("dist"))
app.use(cookieParser())
app.use(cors({
    origin: process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://portfolio-booststap-1.onrender.com",

    credentials: true
}))
app.use("/api/auth", require('./router/auth.router'))
app.use("/api/admin", adminProtected, require('./router/admin.router'))
app.use("/api/public", require('./router/public.router'))


app.use("*", (req, res) => {
    // res.status(404).json({ message: "Resource Not Found" })
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json(`{ message: server error${err.message} }`)
})
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("MONGOOSE CONNECTED")
    app.listen(process.env.PORT, console.log("SERVER RUNNING"))
})