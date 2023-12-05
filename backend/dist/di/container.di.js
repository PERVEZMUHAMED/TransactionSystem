"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getuser = exports.withdraw = exports.deposit = exports.currency = exports.user = void 0;
const inversify_1 = require("inversify");
const user_business_1 = __importDefault(require("../business/user.business"));
const Types_1 = require("./Types");
const user_repository_1 = __importDefault(require("../repository/user.repository"));
const currency_repository_1 = __importDefault(require("../repository/currency.repository"));
const currency_business_1 = __importDefault(require("../business/currency.business"));
const deposit_repository_1 = __importDefault(require("../repository/deposit.repository"));
const deposit_business_1 = __importDefault(require("../business/deposit.business"));
const withdraw_repository_1 = __importDefault(require("../repository/withdraw.repository"));
const withdraw_business_1 = __importDefault(require("../business/withdraw.business"));
const getuser_business_1 = __importDefault(require("../business/getuser.business"));
const getuser_repository_1 = __importDefault(require("../repository/getuser.repository"));
const container = new inversify_1.Container();
container.bind(Types_1.TYPES.User).to(user_repository_1.default);
container.bind(Types_1.TYPES.Currency).to(currency_repository_1.default);
container.bind(Types_1.TYPES.Deposit).to(deposit_repository_1.default);
container.bind(Types_1.TYPES.Withdraw).to(withdraw_repository_1.default);
container.bind(Types_1.TYPES.Getuser).to(getuser_repository_1.default);
exports.user = container.resolve(user_business_1.default);
exports.currency = container.resolve(currency_business_1.default);
exports.deposit = container.resolve(deposit_business_1.default);
exports.withdraw = container.resolve(withdraw_business_1.default);
exports.getuser = container.resolve(getuser_business_1.default);