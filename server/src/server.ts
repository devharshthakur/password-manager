import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ErrorType } from "./util/types/types";
import User from "./models/User";
import { encryptUserData } from "./middlewares/encryptionMiddleware";
import { log } from "console";
import connectDB from "./util/connectDB";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({origin:'*'}));

// Middlwears //
app.use(bodyParser.json());

// MongoDB Connection
connectDB();

// Add new data to MongoDB
app.post("/add", encryptUserData, async (req: Request, res: Response) => {
  const { label, encryptedUsername, encryptedPassword } = req.body;

  try {
    // create and save the user in MongoDB
    const newUser = new User({
      label,
      encryptedUsername,
      encryptedPassword,
    });

    await newUser.save();
    res.status(200).send(`Data Saved Successfully to MongoDB`);
  } catch (err) {
    const error = err as ErrorType;
    if (error.code === 11000) {
      return res.status(400).send("Label already exits");
    }
    res.status(500).send(`Error saving the data: ${error.message}`);
  }
});

app.post("/search", async (req: Request, res: Response) => {
  const { label } = req.body;

  if (!label) {
    return res.status(400).send("Label is Required");
  }

  try {
    // Find entry label in MongoDB
    const entry = await User.findOne({ label });

    if (!entry) {
      return res.status(404).send("Label not found");
    }

    // Decrypt the username and passwordusing model methods
    const decryptedUsername = entry.getDecryptedUsername();
    const decryptedPassword = entry.getDecryptedPassword();

    // Return the decrypted username and passsword
    res.json({
      username: decryptedUsername,
      password: decryptedPassword,
    });
  } catch (err) {
    const error = err as ErrorType;
    res.status(500).send(`Error retriving the data: ${error.message}`);
  }
});

// Delete user by label
app.delete('/delete', async (req: Request, res: Response) => {
  const { label } = req.body;

  if (!label) {
    return res.status(400).send('Label is required for deletion');
  }

  try {
    // find the label
    const deletedUser = await User.findOneAndDelete({ label });

    if (!deletedUser) {
      return res.status(404).send(`User with label "${label}" not found`);
    }

    res.status(200).send(`User with label "${label}" deleted successfully`);
  } catch (err) {
    const error = err as ErrorType;
    res.status(500).send(`Error deleting user: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});