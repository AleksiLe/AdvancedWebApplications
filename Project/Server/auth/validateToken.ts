import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import passport from "./passport-config";

interface CustomRequest extends Request {
  user?: JwtPayload;
}

export const validateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error | null, verifiedUser: JwtPayload | null) => {
      if (err || !verifiedUser) {
        return res.sendStatus(401);
      }
      req.user = verifiedUser;
      next();
    }
  )(req, res, next);
};
