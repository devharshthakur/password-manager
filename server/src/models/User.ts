import mongoose, { Schema, Document } from 'mongoose';
import { decryptData, encryptData } from '../util/encryptionUtil';

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
    default:''
  },
  encryptedPassword: {
    type: String,
    default:''
  },
});
// Password hashing middleware
/* 
 It checks wheather the password is modified or not ,
 if yes then it will go for hashing otherwise not.
*/
UserSchema.pre<IUser>('save', function (next) {
  if (this.isModified('username')) {
    this.encryptedUsername = encryptData(this.username!);
    this.username = undefined; // Remove plaintext username
  }

  if (this.isModified('password')) {
    this.encryptedPassword = encryptData(this.password!);
    this.password = undefined; // Remove plaintext password
  }
  next();
});

// Methods to decrypt data
UserSchema.methods.getDecryptedUsername = function () {
  return decryptData(this.encryptedUsername);
};

UserSchema.methods.getDecryptedPassword = function () {
  return decryptData(this.encryptedPassword);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;