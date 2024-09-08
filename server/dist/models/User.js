"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const encryptionUtil_1 = require("../util/encryptionUtil");
// Schema for the password storage
const UserSchema = new mongoose_1.default.Schema({
    label: {
        type: String,
        required: true,
        unique: true,
    },
    encryptedUsername: {
        type: String,
        default: ''
    },
    encryptedPassword: {
        type: String,
        default: ''
    },
});
// Password hashing middleware
/*
 It checks wheather the password is modified or not ,
 if yes then it will go for hashing otherwise not.
*/
UserSchema.pre('save', function (next) {
    if (this.isModified('username')) {
        this.encryptedUsername = (0, encryptionUtil_1.encryptData)(this.username);
        this.username = undefined; // Remove plaintext username
    }
    if (this.isModified('password')) {
        this.encryptedPassword = (0, encryptionUtil_1.encryptData)(this.password);
        this.password = undefined; // Remove plaintext password
    }
    next();
});
// Methods to decrypt data
UserSchema.methods.getDecryptedUsername = function () {
    return (0, encryptionUtil_1.decryptData)(this.encryptedUsername);
};
UserSchema.methods.getDecryptedPassword = function () {
    return (0, encryptionUtil_1.decryptData)(this.encryptedPassword);
};
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
