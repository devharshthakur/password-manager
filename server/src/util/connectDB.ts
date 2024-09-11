// Use to connect to mongo db database
import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://harshprojects2002:harsh2002@password-manager.nqmmp.mongodb.net/";

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
