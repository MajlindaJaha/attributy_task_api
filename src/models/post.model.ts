import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPost extends Document {
  _id: string;
  postId: string;
  title: string;
  content?: string;
}

const PostSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    postId: {
      type: String,
      unique: true,
      required: true,
      default: uuidv4,
    },
    title: {
      type: String,
      required: [true, "Post title is required"],
    },
    content: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;
