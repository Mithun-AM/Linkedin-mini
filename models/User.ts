import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    bio: { type: String, default: '', maxLength: 160 },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>('User', UserSchema);
export default User;