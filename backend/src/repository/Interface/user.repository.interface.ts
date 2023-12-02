
export default interface IUserRepository {
    create:(args:any, model:any)=>any;
    findOne:(args:any, model:any)=>any;
    find:(args:any, model:any)=>any;
    findById:(args:any, model:any)=>any;
}