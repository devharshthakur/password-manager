import { Request, Response, NextFunction } from "express";
import { encryptData } from "../util/encryptionUtil";

// Middleware to encrypt the username and password before saving to MongoDB
export function encryptUserData(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  // Encrypt username and password
  req.body.encryptedUsername = encryptData(username);
  req.body.encryptedPassword = encryptData(password);

  // Remove plaintext username and password from the request body
  delete req.body.username;
  delete req.body.password;

  next(); // Continue to the next middleware or route handler
}
