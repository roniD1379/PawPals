import { Schema, model, mongo } from "mongoose";

export interface IUser {
  _id?: mongo.ObjectId;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  userImage?: string;
  description?: string;
  phoneNumber: string;
  refreshTokens?: string[];
  authSource?: string;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
  authSource: {
    type: String,
    enum: ["self", "google"],
    default: "self",
  },
});

export default model<IUser>("User", userSchema, "Users");
