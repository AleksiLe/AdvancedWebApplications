import multer, { Multer, StorageEngine } from "multer";
import mongoose from "mongoose";

const mongoDB: string = "mongodb://127.0.0.1:27017/project";
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db: mongoose.Connection = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

export { upload, db };
