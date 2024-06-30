import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
