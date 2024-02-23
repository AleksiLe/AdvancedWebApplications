import { JwtPayload } from "jsonwebtoken";
import passport, { DoneCallback } from "passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
//import dotenv from "dotenv"
import { User, IUser } from "../database/models/Users";

//dotenv.config()
passport.initialize();

const jwtStrategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "Secret" /* process.env.SECRET as string */,
};

const jwtStrategy = new Strategy(
  jwtStrategyOptions,
  async (payload: JwtPayload, done: DoneCallback) => {
    try {
      const user: IUser | null = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
);

export default passport.use(jwtStrategy);
