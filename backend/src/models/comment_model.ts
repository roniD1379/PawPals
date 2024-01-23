import { Schema, model, mongo } from "mongoose";

export interface IComment {
  _id: mongo.ObjectId;
  postId: mongo.ObjectId;
  text: string;
  ownerId: mongo.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const comment = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IComment>("Comment", comment, "Comments");
