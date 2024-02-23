import express, { NextFunction } from "express";
import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { ValidationError, validationResult, Result } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import { upload } from "../database/db";
import { validateToken } from "../auth/validateToken";
import { validateEmail, validatePassword } from "../auth/inputValidations";

//db tables and interfaces
import { User, IUser } from "../database/models/Users";
import { Image, IImage } from "../database/models/Images";
import { Message, IMessage } from "../database/models/Messages";

const router: Router = express.Router();

router.post(
  "/sendMessage",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const user: IUser | null = (await User.findById(
          (req.user as IUser)._id
        )) as IUser | null;
        if (user) {
          const message = await Message.create({
            userIDfrom: user._id,
            userIDto: req.body.userID,
            message: req.body.message,
            timeStamp: Date.now(),
          });
          return res.json({ success: "Message sent", message: message });
        }
      }
    } catch (error) {
      console.log(`Error during message sending: ${error}`);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//Functions and interfaces for getUserMessages
interface Message {
  direction: string;
  message: string;
  timeStamp: Date;
}
interface Messages {
  userID: string;
  messages: Message[];
}
interface IUserWithMessages {
  _id: string;
  username: string;
  profilePictureID: string;
  messages: Message[];
}

router.get(
  "/getUserMessages",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      const user: IUser | null = (await User.findById(
        (req.user as IUser)._id,
        "-password -email"
      )) as IUser | null;
      if (user) {
        const usersWithMessages = await getMessages(user);

        return res.json({ success: true, users: usersWithMessages });
      } else {
        return res.json({ success: false, users: null });
      }
    } catch (error) {
      console.log(`Error during user retrieval: ${error}`);
    }
  }
);

const getMessages = async (user: IUser) => {
  try {
    const users: IUser[] | undefined = await getUsersFromIDs(user.matches);
    const usersWithMessages: IUserWithMessages[] = [];
    if (users) {
      for (let i = 0; i < users.length; i++) {
        const messages: Message[] | undefined = await getMessagesFromDatabase(
          user._id,
          users[i]._id
        );
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
  } catch (error) {}
};

const getMessagesFromDatabase = async (userID1: string, userID2: string) => {
  try {
    let message: Message[] = [];

    const messagesFromUser: IMessage[] | null = (await Message.find({
      userIDfrom: userID2,
      userIDto: userID1,
    })) as IMessage[] | null;
    if (messagesFromUser) {
      for (let j = 0; j < messagesFromUser.length; j++) {
        message.push({
          direction: "incoming",
          message: messagesFromUser[j].message,
          timeStamp: messagesFromUser[j].timeStamp,
        });
      }
    }
    const messagesToUser: IMessage[] | null = (await Message.find({
      userIDfrom: userID1,
      userIDto: userID2,
    })) as IMessage[] | null;
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
  } catch (error) {}
};

//Function for getting users from userIDs
const getUsersFromIDs = async (userIDs: string[]) => {
  try {
    let users: IUser[] = [];
    for (let i = 0; i < userIDs.length; i++) {
      const user: IUser | null = (await User.findById(
        userIDs[i],
        "-password -email -matches"
      )) as IUser | null;
      if (user) {
        users.push(user);
      }
    }
    return users;
  } catch (error) {}
};

export default router;
