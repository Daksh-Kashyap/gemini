import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose, { connect } from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/authRoutes.js";



const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);


const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});




// app.post("/test",async (req, res) => {
    
// });

