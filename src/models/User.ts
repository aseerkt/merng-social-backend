import mongoose, { Document } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class IUser {
  @Field(() => ID)
  _id: string;
  @Field()
  username: string;
  @Field()
  email: string;
  password: string;
}

export type UserType = IUser & Document;

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>('User', UserSchema);

export default User;
