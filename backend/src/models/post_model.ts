import {Schema, model} from 'mongoose';

export interface IPost {
  description: string;
  image?: string; //todo
  breed: string;
  userIdOwner: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
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
  userIdOwner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
    required: true,
  },
});



export default model<IPost>("Post", postSchema, "Posts");
