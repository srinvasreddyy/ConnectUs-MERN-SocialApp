import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
const app = express()
app.use(cors(
    {
        origin : "http://localhost:5173",
        credentials : true
    }
))
dotenv.config()
const PORT =  process.env.PORT || 8005
app.use(express.json()) // to get data from req.body

//to handle cookies
app.use(cookieParser())

const __dirname = path.resolve()

//routing passing
import authRoutes from "./routes/auth.route.js"
app.use("/api/auth",authRoutes)

import userRoutes from "./routes/user.route.js"
app.use("/api/user",userRoutes)


import chatRoutes from "./routes/chat.route.js"
app.use("/api/chat",chatRoutes)

import chatbotRoutes from "./routes/chatbot.route.js"
app.use("/api/chatbot",chatbotRoutes)


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend","dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}


//connecting to database and connecting to local host
import { connectDB } from "./lib/db.js"
connectDB()
.then(
    app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
    })
)
.catch(err=>{
    console.log(err)
})
