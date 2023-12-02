import {gql} from "apollo-server-express";

export const typeDefs = gql `
    type User {
        _id:ID
        userName:String
        password:String
        email:String
        token:String
        personalDetails:Personal
    }
    type Personal {
        age:Int
        gender:String
    }
    type Login {
        _id:ID
        email:String
        token:String
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
    input loginInput {
        email:String
        password:String
    }
    input personalInput {
        age:Int
        gender:String
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
        updateUser(input:userInput):Updateuser
        createCurrency(input:currencyInput):Currency
        createDeposit(input:depositInput): Deposit
        createWithdraw(input:withdrawInput):Withdraw
    }
    type Query {
        getUser(_id:ID!):User
    }
`;