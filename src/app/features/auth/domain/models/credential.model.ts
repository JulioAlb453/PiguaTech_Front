// esta interfaz define el modelo de credenciales que se utiliza para la autenticación
// en la aplicación, incluyendo el correo electrónico y la contraseña del usuario.
export interface CredentialModel {
    email: string;
    password: string;
}
