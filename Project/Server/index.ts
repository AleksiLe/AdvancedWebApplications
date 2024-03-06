import express from "express";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import passport from "passport";
import passportLocal from "passport-local";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";

//route imports
import userPath from "./routes/user";
import messagePath from "./routes/message";

//db imports
//import { upload } from "./database/db";
import { body } from "express-validator";

const corsOptions: CorsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

const app: Express = express();

app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user/", userPath);
app.use("/chat/", messagePath);

const port: Number = 3001; // change to env

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
