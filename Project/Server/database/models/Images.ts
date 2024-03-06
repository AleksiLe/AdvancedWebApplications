import mongoose, { Document, Schema } from "mongoose";

interface IImage extends Document {
  _id: string;
  name: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
}

let imageSchema: Schema = new Schema({
  name: String,
  encoding: String,
  mimetype: String,
  buffer: Buffer,
});

const Image: mongoose.Model<IImage> = mongoose.model<IImage>(
  "Image",
  imageSchema
);

export { Image, IImage };
