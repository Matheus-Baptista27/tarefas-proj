import { BadRequestError } from "../errors/bad-request.error";

export function validateTask(request, response, next) {
    const date = request.body.date;
    if (!date) {
        return response.status(400).json(new BadRequestError("Data não informada"));
    }

    if (isNaN(new Date(date))) {
        return response.status(400).json(new BadRequestError("Data inválida"));
    }

    const taskType = request.body.taskType;
    if (!taskType) {
        return response.status(400).json(new BadRequestError("Tipo de tarefa não informado"));
    }

    const type = request.body.type;
    if (!type) {
        return response.status(400).json(new BadRequestError("Tipo não informado"));
    }

    if (type !== "open" && type !== "closed") {
        return response.status(400).json(new BadRequestError("Tipo inválido"));
    }

    next();
}


/*import { BadRequestError } from "../errors/bad-request.error";

export function validateTask(request, response, next) {
    const date = request.body.date;
    if(!date) {
        return response.status(400).json(new BadRequestError("Data não informada"));
    }

    if (isNaN(new Date(date))) {
        return response.status(400).json(new BadRequestError("Data inválida"));
        }
    const taskType = request.body.taskTypeType;
    if (!taskType) {
        return response.status(400).json(new BadRequestError("Tipo de tarefa nao informado"));
    }
    
    const type = request.body.type;
    if (!type) {
         return response.status(400).json(new BadRequestError("Tipo nao informado"));
    }

    if (type != "open" && type != "closed") {
        return response.status(400).json(new BadRequestError("Tipo nao inválido"));
    }
    
    next();

    }*/