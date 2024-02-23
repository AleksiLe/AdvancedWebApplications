import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  username: string;
  profilePictureID: string;
  matches: string[];
}

let userSchema: Schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  profilePictureID: { type: String, required: false },
  matches: { type: [String], required: false },
});

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema);

export { User, IUser };
