import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database/db.js";
dotenv.config();
const app = express();
const port = process.env.PORT;


// import routes
import tasks from "./routes/tasks.js";

app.use(express.json())

app.use(cors());


// connect with db
connectDB();


// apis
app.use("/api/tasks", tasks);


app.get("/", async(req, res) => {
    res.send("Todo app server running with postgres")
})

app.listen(port, () => {
    console.log(`todo server running on server http://localhost:${port}`);
})