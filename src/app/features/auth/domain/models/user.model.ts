// esta interfaz define el modelo de usuario que se utiliza en la aplicación, incluyendo
// el nombre, el correo electrónico y el token de autenticación del usuario.

import { UserRole } from "./user-role.enum";
export interface UserModel {
    id: string
    name: string;
    email: string;
    role: UserRole
    token: string;
}
