import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { errorHandler } from "./middlewares/errorHandler.js"
import router from "./routes/user.route.js"
import swagger from "./docs/swagger.json" assert{type:"json"}
import swaggerUi from "swagger-ui-express"
const app=express()
dotenv.config()
//middlewares
app.use(express.json())
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swagger))
//routes
app.use(router)
const port=process.env.PORT   
//connect to database
mongoose.connect(`${process.env.MONGODB_URI}`)
.then(()=>{
    app.listen(port,()=>{
        console.log(`server running on port ${port}`)
        console.log("database connected")
    })  
})
.catch((error)=>{
    console.log(error)
})
// errorHandler middleware
 app.use(errorHandler)
