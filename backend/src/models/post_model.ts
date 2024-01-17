import {Schema, model, mongo} from 'mongoose';

export interface IPost {
  description: string;
  image?: string; //todo
  breed: string;
  breedId: number;
  userIdOwner: mongo.ObjectId;
  likes: Array<mongo.ObjectId>;
}

const postSchema = new Schema<IPost>({
  description: {
    type: String,
    required: true,
  },
  image: { //todo
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
  userIdOwner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
    required: true,
  },
}, { timestamps: true });



export default model<IPost>("Post", postSchema, "Posts");
