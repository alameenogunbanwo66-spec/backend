const express = require("express")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const userAuthRouter = require("./Routes/userAuthRoutes")
const productRouter = require("./Routes/productRoutes")
const orderRoutes = require("./Routes/OrderRoute")
const paymentRoutes = require("./Routes/PaymentRoute");
const webhookRoutes = require("./Routes/webhook")
const adminRouter = require("./Routes/adminRoute")

//middlewares
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173", "https://fontend-nine-delta.vercel.app"],
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
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter)
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);

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