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
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../database/db");
const validateToken_1 = require("../auth/validateToken");
const inputValidations_1 = require("../auth/inputValidations");
const matcher_1 = require("./matcher");
//db tables and interfaces
const Users_1 = require("../database/models/Users");
const Images_1 = require("../database/models/Images");
const router = express_1.default.Router();
/*
Uses validation middleware to check if the email and password are valid
Uploads the image to the database if it exists
Creates a new user in the database
Creates a new match table for the user
*/
router.post("/register", db_1.upload.single("image"), inputValidations_1.validateEmail, inputValidations_1.validatePassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = yield Users_1.User.findOne({
            email: req.body.email,
        });
        if (existingUser) {
            return res
                .status(403)
                .json({ success: false, message: "Email already in use." });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        let imageName;
        let encoding;
        let mimetype;
        let buffer;
        if (req.body.image === "undefined") {
            yield Users_1.User.create({
                email: req.body.email,
                password: hash,
                username: req.body.username,
            }).then((user) => {
                user.save();
                (0, matcher_1.createMatchTable)(user._id);
            });
            console.log("User registered successfully.");
            return res
                .status(200)
                .json({ success: true, message: "User registered successfully." });
        }
        else if (req.file) {
            imageName = req.file.originalname;
            encoding = req.file.encoding;
            mimetype = req.file.mimetype;
            buffer = req.file.buffer;
        }
        const userImage = yield Images_1.Image.create({
            name: imageName,
            encoding: encoding,
            mimetype: mimetype,
            buffer: buffer,
        });
        if (userImage) {
            yield Users_1.User.create({
                email: req.body.email,
                password: hash,
                username: req.body.username,
                profilePictureID: userImage._id,
            }).then((user) => {
                user.save();
                (0, matcher_1.createMatchTable)(user._id);
            });
            console.log("User registered successfully.");
            return res
                .status(200)
                .json({ success: true, message: "User registered successfully." });
        }
    }
    catch (error) {
        console.error(`Error during user registration: ${error}`);
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
    }
}));
/*
Edits users username, email and password
after validation, the user is updated in the database
*/
router.post("/edit", validateToken_1.validateToken, inputValidations_1.validateEmail, inputValidations_1.validatePassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const user = yield Users_1.User.findById(req.user._id);
        if (user) {
            const salt = bcrypt_1.default.genSaltSync(10);
            const hash = bcrypt_1.default.hashSync(req.body.password, salt);
            if (req.body.email != "") {
                const userWithSameEmail = yield Users_1.User.findOne({
                    email: req.body.email,
                });
                if (userWithSameEmail) {
                    return res
                        .status(403)
                        .json({ success: false, message: "Email already in use." });
                }
                user.email = req.body.email;
            }
            if (req.body.password != "") {
                user.password = hash;
            }
            if (req.body.username != "") {
                user.username = req.body.username;
            }
            user.save();
            return res.status(200).json({ success: true });
        }
    }
    catch (error) {
        console.error(`Error during user update: ${error}`);
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
    }
}));
/*

*/
router.post("/login", inputValidations_1.validateEmail, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Users_1.User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(403).json({ success: false, message: "Login failed" });
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
            const jwtPayload = {
                id: user._id,
                email: user.email,
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, "Secret" /* process.env.SECRET as string */, {
                expiresIn: "1h",
            });
            return res.json({ success: true, token });
        }
        return res.status(401).json({ success: false, message: "Login failed" });
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/verify", validateToken_1.validateToken, (req, res) => {
    try {
        return res.json({ success: true });
    }
    catch (error) {
        console.log(`Error during user verification: ${error}`);
        return res.json({ failure: "User not authenticated" });
    }
});
router.get("/image/:id", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        const image = yield Images_1.Image.findById(req.params.id);
        if (!image) {
            return res
                .status(404)
                .json({ sucess: false, message: "Image not found" });
        }
        if (image) {
            res.setHeader("Content-Type", `${image.mimetype}`);
            res.setHeader("Content-Dispositiom", "inline");
            const base64String = Buffer.from(image.buffer).toString("base64");
            const imageUrl = `data:${image.mimetype};base64,${base64String}`;
            return res.json({ success: true, imageUrl: imageUrl });
        }
    }
    catch (error) {
        console.log(`Error during image retrieval: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
//Matching related routes
router.get("/potentialMatches", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("user:", req.user._id + " asked for potential matches.");
        if (req.user) {
            const matches = (yield (0, matcher_1.getPotentialMatches)(req.user._id));
            if (matches) {
                return res.json({
                    success: "Returned potential matches",
                    matches: matches,
                });
            }
            else {
                return res.json({ success: "No more users", matches: null });
            }
        }
        else {
            return res.status(401).json({ failure: "User not authenticated" });
        }
    }
    catch (error) { }
}));
router.post("/like", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            console.log(req.body.userId, req.user._id);
            yield (0, matcher_1.updateMatchDocument)(req.user._id, req.body.userId, req.body.liked);
        }
    }
    catch (error) { }
}));
exports.default = router;
