// Use to connect to mongo db database
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "your-default-mongo-uri";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

export default connectDB;
