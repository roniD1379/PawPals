import mongoose from "mongoose";

export interface IUser {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  refreshTokens?: string[]; //todo
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  refreshTokens: { //todo
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUser>("User", userSchema);
