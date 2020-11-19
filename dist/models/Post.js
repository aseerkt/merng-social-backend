"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const type_graphql_1 = require("type-graphql");
let Comment = class Comment {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    __metadata("design:type", String)
], Comment.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Comment.prototype, "body", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Comment.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Comment.prototype, "createdAt", void 0);
Comment = __decorate([
    type_graphql_1.ObjectType()
], Comment);
let Like = class Like {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    __metadata("design:type", String)
], Like.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Like.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Like.prototype, "createdAt", void 0);
Like = __decorate([
    type_graphql_1.ObjectType()
], Like);
let IPost = class IPost {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    __metadata("design:type", String)
], IPost.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], IPost.prototype, "body", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], IPost.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => [Comment]),
    __metadata("design:type", Array)
], IPost.prototype, "comments", void 0);
__decorate([
    type_graphql_1.Field(() => [Like]),
    __metadata("design:type", Array)
], IPost.prototype, "likes", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    __metadata("design:type", String)
], IPost.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], IPost.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], IPost.prototype, "updatedAt", void 0);
IPost = __decorate([
    type_graphql_1.ObjectType()
], IPost);
exports.IPost = IPost;
const PostSchema = new mongoose_1.default.Schema({
    body: String,
    username: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],
    likes: [
        {
            username: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });
const Post = mongoose_1.default.model('Post', PostSchema);
exports.default = Post;
//# sourceMappingURL=Post.js.map