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
exports.PostResolver = exports.PostHandleResponse = exports.CreatePostResponse = void 0;
const Post_1 = __importStar(require("../models/Post"));
const type_graphql_1 = require("type-graphql");
const checkAuth_1 = require("../middlewares/checkAuth");
const User_1 = __importDefault(require("../models/User"));
let CreatePostResponse = class CreatePostResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], CreatePostResponse.prototype, "ok", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], CreatePostResponse.prototype, "error", void 0);
CreatePostResponse = __decorate([
    type_graphql_1.ObjectType()
], CreatePostResponse);
exports.CreatePostResponse = CreatePostResponse;
let PostHandleResponse = class PostHandleResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], PostHandleResponse.prototype, "ok", void 0);
__decorate([
    type_graphql_1.Field(() => Post_1.IPost, { nullable: true }),
    __metadata("design:type", Post_1.IPost)
], PostHandleResponse.prototype, "post", void 0);
PostHandleResponse = __decorate([
    type_graphql_1.ObjectType()
], PostHandleResponse);
exports.PostHandleResponse = PostHandleResponse;
let PostResolver = class PostResolver {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield Post_1.default.find().sort({ createdAt: -1 });
                if (!posts) {
                    return null;
                }
                return posts;
            }
            catch (err) {
                console.error(err);
                return null;
            }
        });
    }
    getPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findById(postId);
            if (!post) {
                return null;
            }
            return post;
        });
    }
    createPost(body, { payload }, pubSub) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.trim() === '')
                return { ok: false, error: 'Body is required' };
            const currentUser = yield User_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
            if (currentUser) {
                const post = new Post_1.default({
                    body,
                    user: currentUser._id,
                    username: currentUser.username,
                });
                yield post.save();
                const pubPost = post;
                yield pubSub.publish('NEW_POST', pubPost);
                return { ok: true };
            }
            return { ok: false, error: 'User not logged in' };
        });
    }
    deletePost(postId, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield Post_1.default.findById(postId);
                if (!post || post.user.toString() !== (payload === null || payload === void 0 ? void 0 : payload.userId))
                    return false;
                yield post.remove();
                return true;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    createComment(postId, body, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (body.trim() === '')
                    return { ok: false };
                const currentUser = yield User_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
                if (!currentUser)
                    return { ok: false };
                const post = yield Post_1.default.findById(postId);
                if (!post)
                    return { ok: false };
                post.comments.unshift({ username: currentUser.username, body });
                yield post.save();
                return { ok: true, post };
            }
            catch (err) {
                console.error(err);
                return { ok: false };
            }
        });
    }
    deleteComment(postId, commentId, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield User_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
                if (!currentUser)
                    return false;
                const post = yield Post_1.default.findById(postId);
                if (!post)
                    return false;
                const selectedComment = post.comments.find((com) => { var _a; return ((_a = com._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
                if (!selectedComment || selectedComment.username !== currentUser.username)
                    return false;
                post.comments = post.comments.filter((com) => { var _a; return ((_a = com._id) === null || _a === void 0 ? void 0 : _a.toString()) !== commentId; });
                yield post.save();
                return true;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    toggleLikePost(postId, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield User_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
                if (!currentUser) {
                    console.log('User not found');
                    return { ok: false };
                }
                const post = yield Post_1.default.findById(postId);
                if (!post) {
                    console.log('Post not found');
                    return { ok: false };
                }
                if (post.likes.some((l) => l.username === currentUser.username)) {
                    post.likes = post.likes.filter((l) => l.username !== currentUser.username);
                }
                else {
                    post.likes.unshift({ username: currentUser.username });
                }
                yield post.save();
                return { ok: true, post };
            }
            catch (err) {
                console.error(err);
                return { ok: false };
            }
        });
    }
    newPost(newPost) {
        const subPost = newPost;
        return subPost._doc;
    }
};
__decorate([
    type_graphql_1.Query(() => [Post_1.IPost]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPosts", null);
__decorate([
    type_graphql_1.Query(() => Post_1.IPost, { nullable: true }),
    __param(0, type_graphql_1.Arg('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPost", null);
__decorate([
    type_graphql_1.Mutation(() => CreatePostResponse),
    type_graphql_1.UseMiddleware(checkAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('body')),
    __param(1, type_graphql_1.Ctx()),
    __param(2, type_graphql_1.PubSub()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(checkAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('postId')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    type_graphql_1.Mutation(() => PostHandleResponse),
    type_graphql_1.UseMiddleware(checkAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('postId')),
    __param(1, type_graphql_1.Arg('body')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createComment", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(checkAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('postId')),
    __param(1, type_graphql_1.Arg('commentId')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deleteComment", null);
__decorate([
    type_graphql_1.Mutation(() => PostHandleResponse),
    type_graphql_1.UseMiddleware(checkAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('postId')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "toggleLikePost", null);
__decorate([
    type_graphql_1.Subscription({ topics: 'NEW_POST' }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.IPost]),
    __metadata("design:returntype", Post_1.IPost)
], PostResolver.prototype, "newPost", null);
PostResolver = __decorate([
    type_graphql_1.Resolver()
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=PostResolver.js.map