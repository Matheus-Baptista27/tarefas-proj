import { TaskNotFoundError } from "./errors/task-not-found.error.js";
import { TaskUidNotInformedError } from "./errors/task-uid-not-informed.error.js";
import { UserDoesntOwnTaskError } from "./errors/user-doesnt-own-task.error.js";
import { UserNotInformedError } from "./errors/user-not-informed.error.js";
import { TaskRepository } from "./repository.js";

export class Task {

    date;
    description;
    taskType;
    type;
    user;
    uid;

    #repository;

    constructor(taskRepository) {
        this.#repository = taskRepository || new TaskRepository();
    }

    findByUser() {
        if (!this.user?.uid) {
            return Promise.reject(new UserNotInformedError());
        }

        return this.#repository.findByUserUid(this.user.uid);
    }

    findByUid() {
        if (!this.uid) {
            return Promise.reject(new TaskUidNotInformedError());
        }

        return this.#repository.findByUid(this.uid).then(taskDb => {
            if (!taskDb) {
                return Promise.reject(new TaskNotFoundError());
            }
            if(this.user.uid != taskDb.user.uid) {
                return Promise.reject(new UserDoesntOwnTaskError());
            }
            this.date = taskDb.date;
            this.description = taskDb.description;
            this.taskType = taskDb.taskType;
            this.type = taskDb.type;
            this.user = taskDb.user;
            return this;
        });
    }

    create(params) {
        this.date = params.date;
        this.description = params.description;
        this.taskType = params.taskType;
        this.type = params.type;
        this.user = params.user;

        return this.#repository.save(this).then(response => {
            this.uid = response.uid;
        });
    }

    update(params) {
        return this.findByUid(this.uid).then(() => {
            this.date = params.date;
            this.description = params.description;
            this.taskType = params.taskType;
            this.type = params.type;
            this.user = params.user;

            return this.#repository.update(this);
        });
    }

    delete() {
        return this.findByUid().then(() => {
            return this.#repository.delete(this);
        })
    }
}
