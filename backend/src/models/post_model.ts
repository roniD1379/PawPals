import { Schema, model, mongo } from "mongoose";

export interface IPost {
  _id: mongo.ObjectId;
  description: string;
  image?: string;
  breed: string;
  breedId: number;
  ownerId: mongo.ObjectId;
  likes: Array<mongo.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    breed: {
      type: String,
      required: true,
    },
    breedId: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IPost>("Post", postSchema, "Posts");
