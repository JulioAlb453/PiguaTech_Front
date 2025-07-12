// esta interfaz define el modelo de usuario que se utiliza en la aplicación, incluyendo
// el nombre, el correo electrónico y el token de autenticación del usuario.
export interface UserModel {
    name: string;
    email: string;
    token: string;
}
