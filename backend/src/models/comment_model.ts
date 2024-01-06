import {Schema, model} from 'mongoose';

export interface IComment {
  postId: Schema.Types.ObjectId;
  text: string;
  ownerId: Schema.Types.ObjectId;
}

const comment = new Schema<IComment>({
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
  }
});

export default model<IComment>("Comment", comment);
