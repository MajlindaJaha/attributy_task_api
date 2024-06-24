import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./src/routes/post.routes";

dotenv.config();

const app = express();
app.use(express.json());

// Mounting the postRoutes for /api/posts endpoint
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    process.env.MONGO_URL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    } as mongoose.ConnectOptions
  )
  .then(() => {
    console.log("Database Connected!");
    app.listen(PORT, () => {
      console.log(`Local Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection failed!", err);
  });
