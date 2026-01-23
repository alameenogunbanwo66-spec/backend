const express = require("express")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const userAuthRouter = require("./Routes/userAuthRoutes")

//middlewares
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials : true
}))

//Routes
//Test Route
app.get("/", (req,res)=>{
    res.status(200).json({ 
        success : true,
        message : "Welcome to GadgetHub Server"})
})

app.use("/api/user/auth", userAuthRouter)

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected");
        app.listen(process.env.PORT, ()=>{
            console.log(`GadgetHub server running on http://localhost:${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}
startServer()