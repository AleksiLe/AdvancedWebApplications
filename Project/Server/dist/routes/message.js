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
                    userIDto: req.body.userID,
                    message: req.body.message,
                    timeStamp: Date.now(),
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
        const user = (yield Users_1.User.findById(req.user._id, "-password -email"));
        if (user) {
            const usersWithMessages = yield getMessages(user);
            return res.json({ success: true, users: usersWithMessages });
        }
        else {
            return res.json({ success: false, users: null });
        }
    }
    catch (error) {
        console.log(`Error during user retrieval: ${error}`);
    }
}));
const getMessages = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield getUsersFromIDs(user.matches);
        const usersWithMessages = [];
        if (users) {
            for (let i = 0; i < users.length; i++) {
                const messages = yield getMessagesFromDatabase(user._id, users[i]._id);
                if (messages) {
                    usersWithMessages.push({
                        _id: users[i]._id,
                        username: users[i].username,
                        profilePictureID: users[i].profilePictureID,
                        messages: messages,
                    });
                }
            }
            return usersWithMessages;
        }
        /* getMessagesFromDatabase(userID, messagesFromUsers); */
        return;
        /* returns array {userID: string, messages: [{
            direction: string,
            message: string,
            WIP - add timestamp}]}
        */ //wip sorter
    }
    catch (error) { }
});
const getMessagesFromDatabase = (userID1, userID2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let message = [];
        const messagesFromUser = (yield Messages_1.Message.find({
            userIDfrom: userID2,
            userIDto: userID1,
        }));
        if (messagesFromUser) {
            for (let j = 0; j < messagesFromUser.length; j++) {
                message.push({
                    direction: "incoming",
                    message: messagesFromUser[j].message,
                    timeStamp: messagesFromUser[j].timeStamp,
                });
            }
        }
        const messagesToUser = (yield Messages_1.Message.find({
            userIDfrom: userID1,
            userIDto: userID2,
        }));
        if (messagesToUser) {
            for (let j = 0; j < messagesToUser.length; j++) {
                message.push({
                    direction: "outgoing",
                    message: messagesToUser[j].message,
                    timeStamp: messagesToUser[j].timeStamp,
                });
            }
            message.sort((a, b) => {
                return Number(a.timeStamp) - Number(b.timeStamp);
            });
        }
        return message;
    }
    catch (error) { }
});
//Function for getting users from userIDs
const getUsersFromIDs = (userIDs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = [];
        for (let i = 0; i < userIDs.length; i++) {
            const user = (yield Users_1.User.findById(userIDs[i], "-password -email -matches"));
            if (user) {
                users.push(user);
            }
        }
        return users;
    }
    catch (error) { }
});
exports.default = router;
