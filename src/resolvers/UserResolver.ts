import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import {
  validateLoginInputs,
  validateRegisterInput,
} from '../utils/userValidators';
import {
  RegisterResponse,
  RegisterInput,
  LoginResponse,
} from '../typeDefs/UserTypes';
import { isAuth } from '../middlewares/checkAuth';
import { MyContext } from '../contextType';

@Resolver()
export class UserResolver {
  @Query(() => String)
  sayHi() {
    return 'Hi';
  }

  @Query(() => IUser)
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: MyContext) {
    return User.findById(payload?.userId);
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Arg('registerInput')
    { username, email, password, confirmPassword }: RegisterInput
  ) {
    try {
      // validate input data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        return { ok: false, errors };
        // throw new UserInputError('Input data errors', { errors });
      }

      // check if user already exists with the same username
      let user = await User.findOne({ username });
      if (user) {
        return { ok: false, errors: { username: 'Username is taken' } };
      }
      user = await User.findOne({ email });
      if (user) {
        return { ok: false, errors: { email: 'Email is already registered' } };
      }

      // hash password and save user
      const hashedPassword = await hash(password);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      // success
      return { ok: true };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string
  ) {
    // validate input data
    const { valid, errors } = validateLoginInputs(username, password);
    if (!valid) {
      return { ok: false, errors };
      // throw new UserInputError('Login input errors', { errors });
    }

    // check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return { ok: false, errors: { username: 'Invalid Username' } };
      // throw new UserInputError('Invalid Credentials');
    }

    // check if password matches
    const match = await verify(user.password, password);
    // console.log(match);
    if (!match) {
      // console.log('Password Mismatch');
      return { ok: false, errors: { password: 'Invalid Credentials' } };
      // throw new UserInputError('Invalid Credentials');
    }

    // success
    return {
      ok: true,
      user,
      token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET!, {
        expiresIn: '7d',
      }),
    };
  }
}
