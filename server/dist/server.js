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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util");
const fs_1 = require("fs");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT;
// Middlwears //
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { label, username, password } = req.body;
    const data = {
        label,
        encryptedUsername: (0, util_1.encryptData)(username),
        encryptedPassword: (0, util_1.encryptData)(password),
    };
    try {
        yield (0, util_1.saveDataToFile)(data);
        res.status(200).send('Data Saved Successfully');
    }
    catch (error) {
        res.status(500).send(`Error saving the data: ${error.message}`);
    }
}));
app.post('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { label } = req.body;
    if (!label) {
        res.status(400).send('Label is Required');
    }
    const filePath = './data/data.json';
    try {
        const data = yield fs_1.promises.readFile(filePath, { encoding: 'utf-8' });
        const passwords = JSON.parse(data);
        // Find the entry with the given label
        const entry = passwords.find((entry) => entry.label === label);
        if (!entry) {
            return res.status(404).send('Label not found');
        }
        // Decrypt the username and paswword
        const decryptedUsername = (0, util_1.decryptData)(entry.encryptedUsername);
        const decryptedPassword = (0, util_1.decryptData)(entry.encryptedPassword);
        // Return the decrypted username and password
        res.json({
            username: decryptedUsername,
            password: decryptedPassword,
        });
    }
    catch (error) {
        res
            .status(500)
            .send(`Error retriving the data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
