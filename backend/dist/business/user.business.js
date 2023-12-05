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
require("reflect-metadata");
const inversify_1 = require("inversify");
const Types_1 = require("../di/Types");
const bcrypt_1 = require("bcrypt");
const apollo_server_errors_1 = require("apollo-server-errors");
const user_model_1 = __importDefault(require("../model/user.model"));
const currency_model_1 = __importDefault(require("../model/currency.model"));
const wallet_model_1 = __importDefault(require("../model/wallet.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = require("nodemailer");
const crypto_1 = require("crypto");
const mongoose_1 = require("mongoose");
let objectId = mongoose_1.Types.ObjectId;
let UserBusiness = class UserBusiness {
    constructor(_user) {
        this._user = _user;
        this.Register = (args) => __awaiter(this, void 0, void 0, function* () {
            const { userName, password, email } = args.input;
            if (!userName || !password || !email) {
                throw new apollo_server_errors_1.ApolloError("401", "Please filled all the fields");
            }
            ;
            try {
                const hashPassword = yield (0, bcrypt_1.hash)(password, 7);
                const existUser = yield this.user.findOne({ userName: userName }, user_model_1.default);
                if (existUser)
                    throw new apollo_server_errors_1.ApolloError("401", "UserName Already Exists");
                const existEmail = yield this.user.findOne({ email: email }, user_model_1.default);
                if (existEmail)
                    throw new apollo_server_errors_1.ApolloError("401", "email Already Exists");
                const createUser = yield this.user.create(Object.assign(Object.assign({}, args.input), { password: hashPassword }), user_model_1.default);
                const currency = yield this.user.find(args.input, currency_model_1.default);
                // console.log("currencyB", currency);
                // console.log("currencyBL", currency.length);
                let curr = [];
                let objec = {};
                for (let i = 0; i < currency.length; i++) {
                    objec = {};
                    objec.currency_id = currency[i]._id;
                    objec.currency = currency[i].code;
                    curr.push(objec);
                }
                ;
                // console.log("curr", curr);
                const wallet = yield this.user.create({
                    user_id: createUser._id,
                    Wallet: curr
                }, wallet_model_1.default);
                console.log("walletB", wallet);
                return createUser;
            }
            catch (error) {
                return error;
            }
        });
        this.Login = (args) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = args.input;
            try {
                const existEmail = yield this.user.findOne({ email: email }, user_model_1.default);
                if (!existEmail)
                    throw new apollo_server_errors_1.ApolloError("Invalid email or password", "401");
                console.log("existEmailB", existEmail);
                const validPw = yield (0, bcrypt_1.compare)(password, existEmail.password);
                if (!validPw)
                    throw new apollo_server_errors_1.ApolloError("Invalid email or password", "401");
                const { JWT_SECRET, JWT_EXPIRES_TIMES } = process.env;
                const token = jsonwebtoken_1.default.sign({ _id: existEmail._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIMES });
                return { token };
            }
            catch (error) {
                return error;
            }
        });
        this.GetUser = (args, context) => __awaiter(this, void 0, void 0, function* () {
            console.log("contextB", context.users._id);
            console.log("argsB", args);
            console.log("contextB", context);
            console.log(context.users._id == new objectId(args._id));
            if (context.users._id == args._id) {
                try {
                    const user = yield this.user.findById({ _id: new objectId(args._id) }, user_model_1.default);
                    console.log("user", user);
                    if (!user)
                        throw new apollo_server_errors_1.ApolloError("401", "user not exits");
                    return user;
                }
                catch (error) {
                    return error;
                }
            }
            else {
                throw new apollo_server_errors_1.ApolloError("you not have access to retrieve this account", "401");
            }
        });
        this.Verifytoken = (args) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { JWT_SECRET } = process.env;
                const decoded = yield jsonwebtoken_1.default.verify(args, JWT_SECRET);
                if (!decoded)
                    throw new apollo_server_errors_1.ApolloError("Unauthorized User", "401");
                const user = yield this.user.findById(decoded._id, user_model_1.default);
                return user;
            }
            catch (error) {
                return error;
            }
        });
        this.changePassword = (args, context) => __awaiter(this, void 0, void 0, function* () {
            const { oldPassword, newPassword } = args.input;
            if (context.users) {
                try {
                    const user = yield this.user.findById({ _id: context.users._id }, user_model_1.default);
                    if (!user)
                        return new apollo_server_errors_1.ApolloError("User not Found", "401");
                    const validOldPW = yield (0, bcrypt_1.compare)(oldPassword, user.password);
                    if (!validOldPW)
                        throw new apollo_server_errors_1.ApolloError("YOur old password is wrong", "401");
                    const hashPassword = yield (0, bcrypt_1.hash)(newPassword, 7);
                    user.password = hashPassword;
                    yield user.save();
                    return true;
                }
                catch (error) {
                    return error;
                }
            }
            else {
                throw new apollo_server_errors_1.ApolloError("First login and then hanlde this resouce", "401");
            }
        });
        this.forgotPassword = (args) => __awaiter(this, void 0, void 0, function* () {
            const { email } = args;
            try {
                const token = (0, crypto_1.randomBytes)(20).toString('hex');
                const resetToken = (0, crypto_1.createHash)("sha256").update(token).digest('hex');
                const expireToken = Date.now() + 30 * 60 * 1000;
                const user = yield this.user.findOne({ email: email }, user_model_1.default);
                if (!user)
                    throw new apollo_server_errors_1.ApolloError("User not found with the email", "401");
                user.resetPasswordToken = resetToken;
                user.resetPasswordTokenExpire = expireToken;
                yield user.save({ validateBeforeSave: false });
                console.log("resetToken");
                console.log("resetPasswordTokenB", user.resetPasswordToken);
                // create a reseturl
                const { PORT } = process.env;
                const resetUrl = `http://localhost:${PORT}/reset-password?token=${resetToken}`;
                const message = `Your password reset url is as follows \n\n
            ${resetUrl} \n\n If you have not requested this email, then ignore it.`;
                const sendEmail = yield this.sendResetPasswordEmail({
                    email: user.email,
                    subject: "JVLCART Password Recovery",
                    message: message
                });
                console.log("sendEmailB", sendEmail);
                return true;
            }
            catch (error) {
                return error;
            }
        });
        this.sendResetPasswordEmail = (options) => __awaiter(this, void 0, void 0, function* () {
            const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_NAME, SMTP_FROM_EMAIL } = process.env;
            const transport = {
                host: SMTP_HOST,
                port: SMTP_PORT,
                auth: {
                    user: SMTP_USER,
                    pass: SMTP_PASS
                },
            };
            const transporter = (0, nodemailer_1.createTransport)(transport);
            const message = {
                from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
                to: options.email,
                subject: options.subject,
                text: options.message
            };
            yield transporter.sendMail(message);
        });
        this.resetPassword = (args) => __awaiter(this, void 0, void 0, function* () {
            const { resetPasswordToken, newPassword } = args;
            try {
                const resetPassword = (0, crypto_1.createHash)('sha256').update(resetPasswordToken).digest('hex');
                console.log("resetPasswordTokenB", resetPassword);
                const user = yield this.user.findOne({
                    resetPasswordToken,
                    resetPasswordTokenExpire: { $gt: Date.now() }
                }, user_model_1.default);
                if (!user)
                    throw new apollo_server_errors_1.ApolloError("Password reset token is invalid or expired", "401");
                console.log("useB", user);
                const hashPassword = yield (0, bcrypt_1.hash)(newPassword, 7);
                user.password = hashPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordTokenExpire = undefined;
                yield user.save({ validateBeforeSave: false });
                // const token = await this.user.({email:user.email}, userModel);
                // console.log("headerTokens", token);
                return "Password resetSuccessfully";
            }
            catch (error) {
                return error;
            }
        });
        this.user = _user;
    }
    ;
};
UserBusiness = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.TYPES.User)),
    __metadata("design:paramtypes", [Object])
], UserBusiness);
exports.default = UserBusiness;
