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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPotentialMatches = exports.updateMatchDocument = exports.createMatchTable = void 0;
//move to different folder
const Matches_1 = require("../database/models/Matches");
const Users_1 = require("../database/models/Users");
//Creates matches for new users from all the old users
const createMatchTable = (createdUserID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield Users_1.User.find();
        const allOtherUsersIDs = allUsers.map((user) => user._id);
        allOtherUsersIDs.splice(allOtherUsersIDs.indexOf(createdUserID), 1);
        for (let i = 0; i < allOtherUsersIDs.length; i++) {
            const newMatch = yield Matches_1.Match.create({
                userIDnew: createdUserID,
                userIDold: allOtherUsersIDs[i],
                userNewLiked: null,
                userOldLiked: null,
            });
            yield newMatch.save();
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.createMatchTable = createMatchTable;
//Updates the match document when a user likes or dislikes another user
const updateMatchDocument = (FromUserID, ToUserID, Liked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Matches_1.Match.findOne({
            userIDnew: FromUserID,
            userIDold: ToUserID,
        }).then((match) => __awaiter(void 0, void 0, void 0, function* () {
            if (match) {
                console.log("match found");
                match.userNewLiked = Liked;
                yield checkMatch(match);
            }
        }));
        yield Matches_1.Match.findOne({
            userIDnew: ToUserID,
            userIDold: FromUserID,
        }).then((match) => __awaiter(void 0, void 0, void 0, function* () {
            if (match) {
                console.log("match found");
                match.userOldLiked = Liked;
                yield checkMatch(match);
            }
        }));
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateMatchDocument = updateMatchDocument;
//checks if the match is a match or not
//it does not delete the match if there is null in one of the
//fields because in this project we needs users to swipe and
//if it deletes matches from other user dislike there wont be
//much to swipe perhaps
const checkMatch = (match) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("CheckMatch modified: " + match);
        if (match.userNewLiked === true && match.userOldLiked === true) {
            addNewMatchToUsers(match.userIDnew, match.userIDold);
            match.save();
        }
        else if ((match.userNewLiked === false && match.userOldLiked === false) ||
            (match.userNewLiked === true && match.userOldLiked === false) ||
            (match.userNewLiked === false && match.userOldLiked === true)) {
            match.save();
            //No notification needed
        }
        else {
            console.log("saving like/dislike matc");
            //if one of the fields is null
            match.save();
        }
    }
    catch (error) {
        console.log(error);
    }
});
const addNewMatchToUsers = (userID1, userID2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user1 = yield Users_1.User.findById(userID1);
        const user2 = yield Users_1.User.findById(userID2);
        if (user1 && user2) {
            user1.matches.push(userID2);
            user2.matches.push(userID1);
            user1.save();
            user2.save();
        }
    }
    catch (error) {
        console.log(error);
    }
});
const getPotentialMatches = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userArray = [];
        const matchNew = yield Matches_1.Match.find({
            userIDnew: userID,
            userNewLiked: null,
        });
        if (matchNew) {
            for (let i = 0; i < matchNew.length; i++) {
                const user = (yield Users_1.User.findById(matchNew[i].userIDold, "-password -email"));
                if (user) {
                    userArray.push(user);
                }
            }
        }
        const matchOld = yield Matches_1.Match.find({
            userIDold: userID,
            userOldLiked: null,
        });
        if (matchOld) {
            for (let i = 0; i < matchOld.length; i++) {
                const user = (yield Users_1.User.findById(matchOld[i].userIDnew, "-password -email"));
                if (user) {
                    userArray.push(user);
                }
            }
        }
        if (userArray.length > 0) {
            return userArray;
        }
        else {
            console.log("userid: " + userID + " Experienced error: EmptyPotential userArray");
            return null;
        }
    }
    catch (error) {
        console.log("userid: " + userID + " Experienced error: " + error);
        return null;
    }
});
exports.getPotentialMatches = getPotentialMatches;
