import { Request } from 'express';
// import { PubSub } from 'apollo-server';

export type MyContext = {
  req: Request;
  // pubsub: PubSub;
  payload?: { userId: string };
};
