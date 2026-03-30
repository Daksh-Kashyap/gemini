import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose, { connect } from "mongoose";
import chatRoutes from "./routes/chat.js";
//import path from "path";



const app = express();
const port = process.env.PORT || 3000;
//const _dirname=path.resolve();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", chatRoutes);


// app.use(express.static(path.join(_dirname,"/Frontend/dist")))
// app.use(express.static(path.join(_dirname, "Frontend/dist")));
// app.get("*", (_req, res) => {
//   res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
// });


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

