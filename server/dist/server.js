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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlwears //
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'my-default-mongo-uri';
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB Connection Error:', err));
// Add new data to MongoDB
app.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { label, username, password } = req.body;
    try {
        // create and save the user in MongoDB
        const newUser = new User_1.default({ label, username, password });
        yield newUser.save();
        res.status(200).send(`Data Saved Successfully to MongoDB`);
    }
    catch (err) {
        const error = err;
        if (error.code === 11000) {
            return res.status(400).send('Label already exits');
        }
        res.status(500).send(`Error saving the data: ${error.message}`);
    }
}));
app.post('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { label } = req.body;
    if (!label) {
        return res.status(400).send('Label is Required');
    }
    try {
        // Find entry label in MongoDB
        const entry = yield User_1.default.findOne({ label });
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
    }
    catch (err) {
        const error = err;
        res.status(500).send(`Error retriving the data: ${error.message}`);
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
