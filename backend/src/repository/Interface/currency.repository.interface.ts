export default interface ICurrencyRepository {
    create:(args:any, model:any)=>any
    findOne:(args:any,model:any)=>any
    updateWallet:(args:any,model:any)=>any
};