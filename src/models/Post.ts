import mongoose, { Document } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
class Comment {
  @Field(() => ID)
  _id?: string;
  @Field()
  body: string;
  @Field()
  username: string;
  @Field()
  createdAt?: string;
}

@ObjectType()
class Like {
  @Field(() => ID)
  _id?: string;
  @Field()
  username: string;
  @Field()
  createdAt?: string;
}

@ObjectType()
export class IPost {
  @Field(() => ID)
  _id: string;

  @Field()
  body: string;

  @Field()
  username: string;

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => [Like])
  likes: Like[];

  @Field(() => ID)
  user: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

export type PostType = IPost & Document;

const PostSchema = new mongoose.Schema(
  {
    body: String,
    username: String,
    comments: [
      {
        body: String,
        username: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likes: [
      {
        username: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<PostType>('Post', PostSchema);

export default Post;
