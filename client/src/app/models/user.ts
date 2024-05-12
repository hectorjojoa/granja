export class User{
   gethash: null | undefined;
   constructor(
    public _id: string, 
    public name: string, 
    public surname: string, 
    public email: string, 
    public password: string,
    public role: string,
    public image: string
    ){}
}