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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponse = exports.RegisterResponse = exports.RegisterInput = void 0;
const User_1 = require("../models/User");
const type_graphql_1 = require("type-graphql");
let RegisterInput = class RegisterInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "confirmPassword", void 0);
RegisterInput = __decorate([
    type_graphql_1.InputType()
], RegisterInput);
exports.RegisterInput = RegisterInput;
let UserFieldError = class UserFieldError {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], UserFieldError.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], UserFieldError.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], UserFieldError.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], UserFieldError.prototype, "confirmPassword", void 0);
UserFieldError = __decorate([
    type_graphql_1.ObjectType()
], UserFieldError);
let RegisterResponse = class RegisterResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], RegisterResponse.prototype, "ok", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", UserFieldError)
], RegisterResponse.prototype, "errors", void 0);
RegisterResponse = __decorate([
    type_graphql_1.ObjectType()
], RegisterResponse);
exports.RegisterResponse = RegisterResponse;
let LoginResponse = class LoginResponse extends RegisterResponse {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], LoginResponse.prototype, "token", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.IUser, { nullable: true }),
    __metadata("design:type", User_1.IUser)
], LoginResponse.prototype, "user", void 0);
LoginResponse = __decorate([
    type_graphql_1.ObjectType()
], LoginResponse);
exports.LoginResponse = LoginResponse;
//# sourceMappingURL=UserTypes.js.map