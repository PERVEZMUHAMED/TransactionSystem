import { Container } from "inversify";
import UserBusiness from "../business/user.business";
import IUserBusiness from "../business/Interface/user.business.interface";
import { TYPES } from "./Types";
import IUserRepository from "../repository/Interface/user.repository.interface";
import UserRepository from "../repository/user.repository";
import ICurrencyRepository from "../repository/Interface/currency.repository.interface";
import CurrencyRepository from "../repository/currency.repository";
import ICurrencyBusiness from "../business/Interface/currency.business.interface";
import CurrencyBusiness from "../business/currency.business";
import IDepositRepository from "../repository/Interface/deposit.repository.interface";
import DepositRepository from "../repository/deposit.repository";
import DepositBusiness from "../business/deposit.business";
import IDepositBusiness from "../business/Interface/deposit.business.interface";
import IWithdrawRepository from "../repository/Interface/withdraw.repository.interface";
import WithdrawRepository from "../repository/withdraw.repository";
import WithdrawBusiness from "../business/withdraw.business";
import IWithdrawBusiness from "../business/Interface/withdraw.business.interface";

const container = new Container();

container.bind<IUserRepository>(TYPES.User).to(UserRepository);
container.bind<ICurrencyRepository>(TYPES.Currency).to(CurrencyRepository);
container.bind<IDepositRepository>(TYPES.Deposit).to(DepositRepository);
container.bind<IWithdrawRepository>(TYPES.Withdraw).to(WithdrawRepository);



export const user = container.resolve<IUserBusiness>(UserBusiness);
export const currency = container.resolve<ICurrencyBusiness>(CurrencyBusiness);
export const deposit = container.resolve<IDepositBusiness>(DepositBusiness);
export const withdraw = container.resolve<IWithdrawBusiness>(WithdrawBusiness);


