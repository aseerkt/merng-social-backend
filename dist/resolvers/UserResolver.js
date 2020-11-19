"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = require("argon2");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
const userValidators_1 = require("../utils/userValidators");
const UserTypes_1 = require("../typeDefs/UserTypes");
const checkAuth_1 = require("../middlewares/checkAuth");
let UserResolver = class UserResolver {
    sayHi() {
        return 'Hi';
    }
    me({ payload }) {
        return User_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
    }
    register({ username, email, password, confirmPassword }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { valid, errors } = userValidators_1.validateRegisterInput(username, email, password, confirmPassword);
                if (!valid) {
                    return { ok: false, errors };
                }
                let user = yield User_1.default.findOne({ username });
                if (user) {
                    return { ok: false, errors: { username: 'Username is taken' } };
                }
                user = yield User_1.default.findOne({ email });
                if (user) {
                    return { ok: false, errors: { email: 'Email is already registered' } };
                }
                const hashedPassword = yield argon2_1.hash(password);
                const newUser = new User_1.default({
                    username,
                    email,
                    password: hashedPassword,
                });
                yield newUser.save();
                return { ok: true };
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { valid, errors } = userValidators_1.validateLoginInputs(username, password);
            if (!valid) {
                return { ok: false, errors };
            }
            const user = yield User_1.default.findOne({ username });
            if (!user) {
                return { ok: false, errors: { username: 'Invalid Username' } };
            }
            const match = yield argon2_1.verify(user.password, password);
            if (!match) {
                return { ok: false, errors: { password: 'Invalid Credentials' } };
            }
            return {
                ok: true,
                user,
                token: jsonwebtoken_1.default.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
                    expiresIn: '7d',
                }),
            };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "sayHi", null);
__decorate([
    type_graphql_1.Query(() => User_1.IUser),
    type_graphql_1.UseMiddleware(checkAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserTypes_1.RegisterResponse),
    __param(0, type_graphql_1.Arg('registerInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserTypes_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserTypes_1.LoginResponse),
    __param(0, type_graphql_1.Arg('username')),
    __param(1, type_graphql_1.Arg('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map