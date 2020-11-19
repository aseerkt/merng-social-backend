import { IUser } from '../models/User';
import { InputType, Field, ObjectType } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
  @Field()
  confirmPassword: string;
}

@ObjectType()
class UserFieldError {
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;
  @Field({ nullable: true })
  confirmPassword: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  ok: boolean;

  @Field({ nullable: true })
  errors: UserFieldError;
}

@ObjectType()
export class LoginResponse extends RegisterResponse {
  @Field({ nullable: true })
  token?: string;

  @Field(() => IUser, { nullable: true })
  user?: IUser;
}
