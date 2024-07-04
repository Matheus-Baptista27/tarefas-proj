export class TaskNotFoundError extends Error {

    constructor() {
        super("Tarefa nao encontrada");
        this.name = "task-not-found";
        this.code = 404;
    }

}