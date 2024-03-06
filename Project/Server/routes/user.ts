import express, { NextFunction } from "express";
import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { ValidationError, validationResult, Result } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import { upload } from "../database/db";
import { validateToken } from "../auth/validateToken";
import { validateEmail, validatePassword } from "../auth/inputValidations";
import {
  createMatchTable,
  getPotentialMatches,
  updateMatchDocument,
} from "./matcher";

//db tables and interfaces
import { User, IUser } from "../database/models/Users";
import { Image, IImage } from "../database/models/Images";
import { Message, IMessage } from "../database/models/Messages";
const router: Router = express.Router();

/*
Uses validation middleware to check if the email and password are valid
Uploads the image to the database if it exists
Creates a new user in the database
Creates a new match table for the user
*/
router.post(
  "/register",
  upload.single("image"),
  validateEmail,
  validatePassword,
  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser: IUser | null = await User.findOne({
        email: req.body.email,
      });

      if (existingUser) {
        return res
          .status(403)
          .json({ success: false, message: "Email already in use." });
      }

      const salt: string = bcrypt.genSaltSync(10);
      const hash: string = bcrypt.hashSync(req.body.password, salt);

      let imageName: string | undefined;
      let encoding: string | undefined;
      let mimetype: string | undefined;
      let buffer: Buffer | undefined;
      if (req.body.image === "undefined") {
        await User.create({
          email: req.body.email,
          password: hash,
          username: req.body.username,
        }).then((user: IUser) => {
          user.save();
          createMatchTable(user._id);
        });
        console.log("User registered successfully.");
        return res
          .status(200)
          .json({ success: true, message: "User registered successfully." });
      } else if (req.file) {
        imageName = req.file.originalname;
        encoding = req.file.encoding;
        mimetype = req.file.mimetype;
        buffer = req.file.buffer;
      }
      const userImage = await Image.create({
        name: imageName,
        encoding: encoding,
        mimetype: mimetype,
        buffer: buffer,
      });

      if (userImage) {
        await User.create({
          email: req.body.email,
          password: hash,
          username: req.body.username,
          profilePictureID: userImage._id,
        }).then((user: IUser) => {
          user.save();
          createMatchTable(user._id);
        });
        console.log("User registered successfully.");
        return res
          .status(200)
          .json({ success: true, message: "User registered successfully." });
      }
    } catch (error: any) {
      console.error(`Error during user registration: ${error}`);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
);
/* 
Edits users username, email and password
after validation, the user is updated in the database
*/
router.post(
  "/edit",
  validateToken,
  validateEmail,
  validatePassword,
  async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const user: IUser | null = await User.findById((req.user as IUser)._id);
      if (user) {
        const salt: string = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(req.body.password, salt);
        if (req.body.email != "") {
          const userWithSameEmail = await User.findOne({
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
    } catch (error: any) {
      console.error(`Error during user update: ${error}`);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
);
/* 
Takes login credentials and checks if the user exists in the database
If the user exists, a jwt token is created and returned to the user
*/
router.post("/login", validateEmail, async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(403).json({ success: false, message: "Login failed" });
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const jwtPayload: JwtPayload = {
        id: user._id,
        email: user.email,
      };
      const token: string = jwt.sign(
        jwtPayload,
        "Secret" /* process.env.SECRET as string */,
        {
          expiresIn: "1h",
        }
      );
      return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: "Login failed" });
  } catch (error: any) {
    console.error(`Error during user login: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/* 
used to check if the user is authenticated
*/
router.post("/verify", validateToken, (req: Request, res: Response) => {
  try {
    return res.json({ success: true });
  } catch (error: any) {
    console.log(`Error during user verification: ${error}`);
    return res.json({ failure: "User not authenticated" });
  }
});

/*
return image from the database
*/
router.get("/image/:id", validateToken, async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    const image = await Image.findById(req.params.id);
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
  } catch (error) {
    console.log(`Error during image retrieval: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//Matching related routes
/*
returns potential matches for the user
*/
router.get(
  "/potentialMatches",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      console.log(
        "user:",
        (req.user as IUser)._id + " asked for potential matches."
      );
      if (req.user) {
        const matches: IUser[] | null = (await getPotentialMatches(
          (req.user as IUser)._id
        )) as IUser[] | null;
        if (matches) {
          return res.json({
            success: "Returned potential matches",
            matches: matches,
          });
        } else {
          return res.json({ success: "No more users", matches: null });
        }
      } else {
        return res.status(401).json({ failure: "User not authenticated" });
      }
    } catch (error) {}
  }
);
/*
post route to like or dislike other users
*/ 
router.post("/like", validateToken, async (req: Request, res: Response) => {
  try {
    if (req.user) {
      console.log(req.body.userId, (req.user as IUser)._id);
      await updateMatchDocument(
        (req.user as IUser)._id,
        req.body.userId,
        req.body.liked
      );
    }
  } catch (error) {}
});

export default router;
