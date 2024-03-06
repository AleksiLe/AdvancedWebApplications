import mongoose, { Document, Schema } from "mongoose";

interface IMatch extends Document {
  _id: string;
  userIDnew: string;
  userIDold: string;
  userNewLiked: boolean;
  userOldLiked: boolean;
}

let matchSchema: Schema = new Schema({
  userIDnew: { type: String, required: true },
  userIDold: { type: String, required: true },
  userNewLiked: { type: Boolean, required: false },
  userOldLiked: { type: Boolean, required: false },
});

const Match: mongoose.Model<IMatch> = mongoose.model<IMatch>(
  "Match",
  matchSchema
);

export { Match, IMatch };
