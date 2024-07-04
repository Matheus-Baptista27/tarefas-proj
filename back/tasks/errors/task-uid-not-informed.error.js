export class TaskUidNotInformedError extends Error {

    constructor() {
        super("Uid da tarefa nao informado");
        this.name = "task-uid-not-informed";
        this.code = 500;
    }

}