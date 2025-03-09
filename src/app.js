import express, { urlencoded } from "express"
// used to get and set the cookie of user brower and and perform CRUD operation on cookies securelt
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express()

app.use(cors({
    // Specifies which domains are allowed to access the backend
    origin: process.env.CORS_ORIGIN,
    // Defines the HTTP methods that are permitted in CORS requests
    methods: ["GET", "POST", "PUT", "DELETE"],
    // Specifies which headers can be included in requests
    allowedHeaders: ["Content-Type", "Authorization"],
    // Allows cookies, sessions, and authentication tokens to be sent with requests
    credentials: true
}));

// Middleware to parse incoming JSON requests with a size limit of 16KB
app.use(express.json({ limit: "16kb" })); 

// Middleware to parse URL-encoded data (form submissions) with extended support for rich objects and arrays, limited to 16KB
app.use(express.urlencoded({ extended: true, limit: "16kb" })); 

// Serves static files (like images, CSS, JavaScript) from the "public" directory
app.use(express.static("public")); 

// Middleware to parse cookies, allowing access to request cookies
app.use(cookieParser()); 

// routes 
import userRouter from './routes/user.routes.js'

// routes declaration
app.use("/api/v1/users",userRouter)

export { app }