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
const validateToken_1 = require("../auth/validateToken");
//db tables and interfaces
const Users_1 = require("../database/models/Users");
const Messages_1 = require("../database/models/Messages");
const router = express_1.default.Router();
router.post("/sendMessage", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const user = (yield Users_1.User.findById(req.user._id));
            if (user) {
                const message = yield Messages_1.Message.create({
                    userIDfrom: user._id,
                    userIDto: req.body.userIDto,
                    message: req.body.message,
                });
                return res.json({ success: "Message sent", message: message });
            }
        }
    }
    catch (error) {
        console.log(`Error during message sending: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/getUserMessages", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = (yield Users_1.User.findById(req.user._id, "-password -email -matches"));
        if (allUsers) {
            console.log(allUsers);
            const messages = yield getMessages(req.user._id);
            return res.json({ success: true, users: allUsers });
        }
        else {
            return res.json({ success: false, users: null });
        }
    }
    catch (error) {
        console.log(`Error during user retrieval: ${error}`);
    }
}));
//Functions for getUserMessages
const getMessages = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.default = router;
