"use strict";
// Used to encrypt and decrypt data
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = void 0;
const crypto_1 = __importDefault(require("crypto"));
/*
We use the aes-256-cbc algorithm, which is AES with a 256-bit key in CBC mode.
AES-256 is one of the most secure encryption methods available.
*/
const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY || 'your-secret-key';
/**
 IV is a random value added to the encryption process
 to make sure that the same data encrypted multiple times results in different outputs.
 It's crucial for the security of CBC (Cipher Block Chaining) mode.
 */
const iv = crypto_1.default.randomBytes(16); // iv:Initialization vector
function encryptData(data) {
    const cipher = crypto_1.default.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    /*
    The function returns a string containing the IV and the encrypted data,
    separated by a colon (:). Both the IV and the encrypted data
    are converted to hexadecimal (hex) format for easier storage and transmission.
    */
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
exports.encryptData = encryptData;
function decryptData(data) {
    const parts = data.split(':'); // split this string into two parts: the IV and the encrypted data.
    const iv = Buffer.from(parts.shift(), 'hex'); // Get the IV from the first part
    /*
    The IV is converted back into a Buffer using Buffer.from(iv, 'hex').
    The encrypted data is similarly converted back into a Buffer using Buffer.from(encryptedText, 'hex').
    */
    const encryptedText = Buffer.from(parts.join(':'), 'hex'); // Get the encrypted text
    const decipher = crypto_1.default.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText); // Decrypt the data
    decrypted = Buffer.concat([decrypted, decipher.final()]); // Finalize the decryption
    return decrypted.toString();
}
exports.decryptData = decryptData;
