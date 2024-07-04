export class UserDoesntOwnTaskError extends Error {
    
    constructor() {
        super('Usuário não autorizado');
        this.name = 'user-doesnt-own-task';
        this.code = 403;
    }
}