"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const apollo_server_1 = require("apollo-server");
const type_graphql_1 = require("type-graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const UserResolver_1 = require("./resolvers/UserResolver");
const PostResolver_1 = require("./resolvers/PostResolver");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const apolloServer = new apollo_server_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({ resolvers: [UserResolver_1.UserResolver, PostResolver_1.PostResolver] }),
        context: ({ req }) => ({ req }),
        cors: { origin: process.env.FRONTEND_URL },
        subscriptions: {
            onConnect: (connectionParams, _ws) => {
                if (connectionParams.authToken) {
                    try {
                        const payload = jsonwebtoken_1.default.verify(connectionParams.authToken, process.env.TOKEN_SECRET);
                        return payload.userId;
                    }
                    catch (err) {
                        throw new apollo_server_1.AuthenticationError('Invalid/Expired Token: ws');
                    }
                }
                throw new apollo_server_1.AuthenticationError('Not Authorized');
            },
        },
    });
    mongoose_1.default
        .connect(process.env.MONGO_REMOTE_URI, {
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
}))();
//# sourceMappingURL=server.js.map