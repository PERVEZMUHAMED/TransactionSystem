export default interface Deposit extends Document {
    user_id:string,
    currency_id:string,
    trasactionId:string,
    currency:string,
    Amount:number
};