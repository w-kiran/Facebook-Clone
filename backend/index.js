import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDatabase from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import { server,app,io } from "./socket/socket.js"
import path from "path";

dotenv.config({})

const __dirname = path.resolve();

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

app.use(express.static(path.join(__dirname,"/frontend/dist")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
})

const PORT = process.env.PORT
server.listen(PORT,()=>{
    connectDatabase();
    console.log(`Listening at ${PORT}`);
})
