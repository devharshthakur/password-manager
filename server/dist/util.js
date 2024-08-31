"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.saveDataToFile = exports.encryptData = void 0;
const fs_1 = require("fs");
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
/* Helper Functions */
const encryptData = (text) => {
    dotenv_1.default.config();
    const secretKey = process.env.SECRET_KEY || '';
    return crypto_js_1.default.AES.encrypt(text, secretKey).toString();
};
exports.encryptData = encryptData;
const saveDataToFile = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = './data/data.json';
    try {
        let fileData;
        try {
            const existingData = yield fs_1.promises.readFile(filePath, { encoding: 'utf8' });
            fileData = JSON.parse(existingData);
        }
        catch (error) {
            fileData = []; // Initialize as an empty object if file reading fails
        }
        // updating the data object
        fileData.push(data);
        // Write the data into the json file
        yield fs_1.promises.writeFile(filePath, JSON.stringify(fileData, null, 2));
    }
    catch (error) {
        throw new Error('Failed to write to file');
    }
});
exports.saveDataToFile = saveDataToFile;
const decryptData = (cipherText) => {
    dotenv_1.default.config();
    const secretKey = process.env.SECRET_KEY || '';
    const bytes = crypto_js_1.default.AES.decrypt(cipherText, secretKey);
    return bytes.toString(crypto_js_1.default.enc.Utf8);
};
exports.decryptData = decryptData;
