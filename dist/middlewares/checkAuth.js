"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_1 = require("apollo-server");
exports.isAuth = ({ context }, next) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
                context.payload = payload;
                return next();
            }
            catch (err) {
                throw new apollo_server_1.AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error('Token not provided in authorization header');
    }
    throw new Error('No authorization header');
};
//# sourceMappingURL=checkAuth.js.map