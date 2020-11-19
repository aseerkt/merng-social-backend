import { MyContext } from 'src/contextType';
import { MiddlewareFn, NextFn } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next: NextFn) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        // console.log('token in the backend', token);
        const payload = jwt.verify(token, process.env.TOKEN_SECRET!);
        context.payload = payload as any;
        return next();
      } catch (err) {
        // console.log('Invalid token error', err);
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error('Token not provided in authorization header');
  }
  throw new Error('No authorization header');
};
