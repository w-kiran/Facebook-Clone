import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDatabase from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import { server,app,io } from "./socket/socket.js"

dotenv.config({})

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"I'm coming from backend",
        success:true
    })
})
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))

const corsOption = {
    origin: process.env.URL,
    credentials:true
}
app.use(cors(corsOption))

app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)

const PORT = process.env.PORT
server.listen(PORT,()=>{
    connectDatabase();
    console.log(`Listening at ${PORT}`);
})