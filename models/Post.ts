import mongoose, { Schema, Document, models } from 'mongoose';
import { IUser } from './User';

export interface IPost extends Document {
  content: string;
  author: IUser['_id'];
  createdAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;
