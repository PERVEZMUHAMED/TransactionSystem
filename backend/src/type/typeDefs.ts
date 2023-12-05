import {gql} from "apollo-server-express";

export const typeDefs = gql `
    type User {
        _id:ID
        userName:String
        password:String
        email:String
        token:String
        walletDetails:[Wallet]
        depositDetails:[Deposit]
        withdrawDetails:[Withdraw]
        auditorDetails:[Auditor]
        personalDetails:Personal
    }
    type Personal {
        age:Int
        gender:String
    }
    type Wallet {
        _id:ID!
        user_id:String
        Wallet:[walletdetail]
    }
    type walletdetail {
        currency_id:String
        currency:String
        Amount:Int
    }
    type Auditor {
        _id:ID!
        user_id:String
        currency_id:String
        transactionId:String
        pre_balance:Int
        post_balance:Int
        category:String
    }
    type Login {
        _id:ID!
        email:String
        token:String
    }
    type Changepassword {
        _id:ID!
        oldPassword:String
        newPassword:String
    }
    type Updateuser {
        _id:ID!
        userName:String
        password:String
        email:String
        token:String
        personalDetails:Personal
    }
    type Currency {
        _id:ID!
        currencyName:String
        code:String
    }
    type Deposit {
        _id:ID!
        user_id:String
        currency_id:String
        transactionId:String
        currency:String
        Amount:Int
    }
    type Withdraw {
        _id:ID!
        user_id:String
        currency_id:String
        transactionId:String
        currency:String
        Amount:Int
    }
    input userInput {
        userName:String
        password:String
        email:String
        personalDetails:personalInput
    }
    input personalInput {
        age:Int
        gender:String
    }
    input loginInput {
        email:String
        password:String
    }
    input changePasswordInput {
        oldPassword:String
        newPassword:String
    }
    input currencyInput {
        currencyName:String
        code:String
    }
    input depositInput {
        user_id:String
        currency_id:String
        transactionId:String
        currency:String
        Amount:Int
    }
    input withdrawInput {
        user_id:String
        currency_id:String
        transactionId:String
        currency:String
        Amount:Int
    }
    type Mutation {
        createUser(input:userInput):User
        Login(input:loginInput):Login
        forgotPassword(email:String!):Boolean
        resetPassword(resetPasswordToken:String newPassword:String):String
        changePassword(input:changePasswordInput):Boolean
        updateUser(input:userInput):Updateuser
        createCurrency(input:currencyInput):Currency
        createDeposit(input:depositInput): Deposit
        createWithdraw(input:withdrawInput):Withdraw
    }
    type Query {
        getUser(_id:ID!):User
        getSpecificUserAllDetails(_id:ID!):[User]
        getSpecificUserAuditorDetails(_id:ID!):[User]
        getSpecificUserAuditorDetailsFDTD(_id:ID! FromDate:String ToDate:String):[User]
    }
`;