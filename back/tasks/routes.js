/*import express from 'express';
import { authenticateToken } from './middlewares/authenticate-jwt.js';
import { TaskController } from './controller.js';

const app = express();

const taskController = new TaskController();

app.get('/', authenticateToken, taskController.findByUser);

export const tasksRouter = app;*/

import express from 'express';
import { authenticateToken } from './middlewares/authenticate-jwt.js';
import { TaskController } from './controller.js';


const tasksRouter = express.Router();
const taskController = new TaskController();

tasksRouter.use(authenticateToken);

tasksRouter.get('/user', 
    (request, response, next) => authenticateToken(request, response, next, admin.auth()),
    (request, response) => taskController.findByUser(request, response)
);
tasksRouter.get('/:uid',
    (request, response, next) => authenticateToken(request, response, next, admin.auth()),
    (request, response) => taskController.findByUid(request, response)
);

tasksRouter.post('/',
    (request, response, next) => validateTask(request, response, next),
    (request, response, next) => authenticateToken(request, response, next, admin.auth()),
    (request, response) => taskController.create(request, response)
);

tasksRouter.patch('/:uid',
    (request, response, next) => validateTask(request, response, next),
    (request, response, next) => authenticateToken(request, response, next, admin.auth()),
    (request, response) => taskController.update(request, response)
);

tasksRouter.delete('/:uid',
    (request, response, next) => authenticateToken(request, response, next, admin.auth()),
    (request, response) => taskController.delete(request, response)
);

export { tasksRouter };
    