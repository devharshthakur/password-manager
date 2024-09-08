import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ErrorType } from './util/types/types';
import User from './models/User';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Middlwears //
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'my-default-mongo-uri';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Add new data to MongoDB
app.post('/add', async (req: Request, res: Response) => {
  const { label, username, password } = req.body;

  try {
    // create and save the user in MongoDB
    const newUser = new User({ label, username, password });
    await newUser.save();
    res.status(200).send(`Data Saved Successfully to MongoDB`);
  } catch (err) {
    const error = err as ErrorType;
    if (error.code === 11000) {
      return res.status(400).send('Label already exits');
    }
    res.status(500).send(`Error saving the data: ${error.message}`);
  }
});

app.post('/search', async (req: Request, res: Response) => {
  const { label } = req.body;

  if (!label) {
    return res.status(400).send('Label is Required');
  }

  try {
    // Find entry label in MongoDB
    const entry = await User.findOne({ label });

    if (!entry) {
      return res.status(404).send('Label not found');
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});