import { Task } from './model.js';

export class TaskController {
    
    #task;

    constructor(task) {
        this.#task = task || new Task();
    }

    findByUser(request, response) {
        this.#task.user = request.user;

        return this.#task.findByUser().then(tasks => {
            response.json(tasks);
        }).catch(error => {
            response.status(error.code).json(error);
        })
    }

    findByUid(request, response) {
        this.#task.uid = request.params.uid;
        this.#task.user = request.user;
    
        return this.#task.findByUid().then(() => {
            response.status(200).json(this.#task);
        }).catch(error => {
            response.status(error.code).json(error);
        });
    }

    create(request, response) {
        this.#task.user = request.user;

        return this.#task.create(request.body).then(() => {
            response.status(200).json(this.#task);
        }).catch(error => {
            response.status(error.code).json(error);
        });
    }

    update(request, response) {
        this.#task.uid = request.params.uid;
        this.#task.user = request.user;

        return this.#task.update(request.body).then(() => {
            response.status(200).json(this.#task);
        }).catch(error => {
            response.status(error.code).json(error);
        });
        
    }

    delete(request, response) {
        this.#task.uid = request.params.uid;
        this.#task.user = request.user;

        return this.#task.delete().then(() => {
            response.status(200);
        }).catch(error => {
            response.status(error.code).json(error);
        })
    }
}


