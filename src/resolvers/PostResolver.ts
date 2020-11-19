import Post, { IPost } from '../models/Post';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql';
import { isAuth } from '../middlewares/checkAuth';
import { MyContext } from '../contextType';
import User from '../models/User';

@ObjectType()
export class CreatePostResponse {
  @Field()
  ok: boolean;
  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
export class PostHandleResponse {
  @Field()
  ok: boolean;
  @Field(() => IPost, { nullable: true })
  post?: IPost;
}

@Resolver()
export class PostResolver {
  // Get all posts
  @Query(() => [IPost])
  async getPosts() {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      if (!posts) {
        return null;
      }
      return posts;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // Get single post
  @Query(() => IPost, { nullable: true })
  async getPost(@Arg('postId') postId: string) {
    const post = await Post.findById(postId);
    if (!post) {
      return null;
    }
    return post;
  }

  // Create post ===================================================================
  @Mutation(() => CreatePostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('body') body: String,
    @Ctx() { payload }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ) {
    if (body.trim() === '') return { ok: false, error: 'Body is required' };
    const currentUser = await User.findById(payload?.userId);
    if (currentUser) {
      const post = new Post({
        body,
        user: currentUser._id,
        username: currentUser.username,
      });
      await post.save();
      const pubPost: IPost = post;
      await pubSub.publish('NEW_POST', pubPost);
      return { ok: true };
    }
    return { ok: false, error: 'User not logged in' };
  }

  // Delete post
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('postId') postId: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const post = await Post.findById(postId);
      if (!post || post.user.toString() !== payload?.userId) return false;
      await post.remove();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // Create comment
  @Mutation(() => PostHandleResponse)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg('postId') postId: string,
    @Arg('body') body: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      if (body.trim() === '') return { ok: false };
      const currentUser = await User.findById(payload?.userId);
      if (!currentUser) return { ok: false };
      const post = await Post.findById(postId);
      if (!post) return { ok: false };
      post.comments.unshift({ username: currentUser.username, body });
      await post.save();
      return { ok: true, post };
    } catch (err) {
      console.error(err);
      return { ok: false };
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg('postId') postId: string,
    @Arg('commentId') commentId: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const currentUser = await User.findById(payload?.userId);
      if (!currentUser) return false;
      const post = await Post.findById(postId);
      if (!post) return false;
      const selectedComment = post.comments.find(
        (com) => com._id?.toString() === commentId
      );
      if (!selectedComment || selectedComment.username !== currentUser.username)
        return false;
      post.comments = post.comments.filter(
        (com) => com._id?.toString() !== commentId
      );

      await post.save();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  @Mutation(() => PostHandleResponse)
  @UseMiddleware(isAuth)
  async toggleLikePost(
    @Arg('postId') postId: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      // console.log(payload);
      const currentUser = await User.findById(payload?.userId);
      if (!currentUser) {
        console.log('User not found');
        return { ok: false };
      }
      const post = await Post.findById(postId);
      if (!post) {
        console.log('Post not found');
        return { ok: false };
      }
      if (post.likes.some((l) => l.username === currentUser.username)) {
        post.likes = post.likes.filter(
          (l) => l.username !== currentUser.username
        );
      } else {
        post.likes.unshift({ username: currentUser.username });
      }
      await post.save();
      return { ok: true, post };
    } catch (err) {
      console.error(err);
      return { ok: false };
    }
  }

  @Subscription({ topics: 'NEW_POST' })
  newPost(@Root() newPost: IPost): IPost {
    // console.log('paylod: ', newPost);
    const subPost: any = newPost;
    return subPost._doc;
  }
}
