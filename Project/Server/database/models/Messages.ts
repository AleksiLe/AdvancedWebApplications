import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  _id: string;
  userIDfrom: string;
  userIDto: string;
  message: string;
  timeStamp: Date;
}

let messageSchema: Schema = new Schema({
  userIDfrom: { type: String, required: true },
  userIDto: { type: String, required: true },
  message: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
});

const Message: mongoose.Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);

export { Message, IMessage };
