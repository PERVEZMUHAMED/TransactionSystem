export default interface Withdraw extends Document {
    user_id:string,
    currency_id:string,
    trasactionId:string,
    currency:string,
    Amount:number
}