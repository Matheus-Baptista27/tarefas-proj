export class UserNotInformedError extends Error {

    constructor() {
        super("Usuário não informado");
        this.nome = "user-not-informed";
        this.code = 500;
    }
}