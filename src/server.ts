import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer, AuthenticationError } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import mongoose from 'mongoose';
import { UserResolver } from './resolvers/UserResolver';
import { PostResolver } from './resolvers/PostResolver';
import { MyContext } from './contextType';
import jwt from 'jsonwebtoken';

(async () => {
  // const pubsub = new PubSub();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver, PostResolver] }),
    context: ({ req }): MyContext => ({ req }),
    cors: { origin: process.env.FRONTEND_URL },
    subscriptions: {
      onConnect: (connectionParams: any, _ws) => {
        if (connectionParams.authToken) {
          try {
            const payload: any = jwt.verify(
              connectionParams.authToken,
              process.env.TOKEN_SECRET!
            );
            return payload.userId;
          } catch (err) {
            throw new AuthenticationError('Invalid/Expired Token: ws');
          }
        }
        throw new AuthenticationError('Not Authorized');
      },
    },
  });
  mongoose
    .connect(process.env.MONGO_REMOTE_URI!, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(({ connection: { host } }) => {
      console.log(`Connected to MongDB: ${host}`);
      return apolloServer.listen({ port: process.env.PORT || 5000 });
    })
    .then(({ url, subscriptionsUrl }) => {
      console.log(`Server Running at ${url}`);
      console.log(`WebSocket Running at ${subscriptionsUrl}`);
    })
    .catch((err) => console.log(err.message));
})();
