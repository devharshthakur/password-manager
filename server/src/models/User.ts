import mongoose, { Schema, Document } from "mongoose";
import { decryptData } from "../util/encryptionUtil";

export interface IUser extends Document {
  label: string;
  username?: string; // Marked as optional because it can be undefined
  password?: string; // "          "
  encryptedUsername: string;
  encryptedPassword: string;
  getDecryptedUsername: () => string;
  getDecryptedPassword: () => string;
}
// Schema for the password storage
const UserSchema: Schema<IUser> = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
  },
  encryptedUsername: {
    type: String,
    required: true,
  },
  encryptedPassword: {
    type: String,
    required: true,
  },
});

// Methods to decrypt data
UserSchema.methods.getDecryptedUsername = function () {
  return decryptData(this.encryptedUsername);
};

UserSchema.methods.getDecryptedPassword = function () {
  return decryptData(this.encryptedPassword);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
