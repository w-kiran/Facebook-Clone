import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDatabase from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"

dotenv.config({})
const app = express()


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

const PORT = process.env.PORT
app.listen(PORT,()=>{
    connectDatabase();
    console.log(`Listening at ${PORT}`);
})