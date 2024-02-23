"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const passport_config_1 = __importDefault(require("./passport-config"));
const validateToken = (req, res, next) => {
    passport_config_1.default.authenticate("jwt", { session: false }, (err, verifiedUser) => {
        if (err || !verifiedUser) {
            return res.sendStatus(401);
        }
        req.user = verifiedUser;
        next();
    })(req, res, next);
};
exports.validateToken = validateToken;
