import { Observable } from "rxjs";
import { UserModel } from "./user.model";
import { UserRole } from "./user-role.enum";

export interface RegisterData{
    names: string
    email : string
    password: string
    rol: UserRole
    token: string
}

export interface IAuthRepository {
    register(data: RegisterData): Observable<UserModel> 

}
