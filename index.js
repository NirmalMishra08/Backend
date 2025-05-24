import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors"
import { startTaskExpiryJob } from "./cron/taskExpiry.js";
dotenv.config();

const app = express();

app.use(cors());


// Add these middleware BEFORE your routes
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


app.use("/api/user",userRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});


connectDB().then(() => {
    startTaskExpiryJob(); // Start the cron job after connecting to the database
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
});