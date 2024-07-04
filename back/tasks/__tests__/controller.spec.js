import { TaskController } from '../controller.js';

describe('Task controller', () => {

    let request;
    let response;

    beforeEach(() => {
        request = { params: {} };
        response = new ResponseMock();
    });

    test('given find task by user, when succes, then return tasks', (done) => {
        const tasks = [{ uid: 1 }, { uid: 2 }];

        const controller = new TaskController({
            findByUser: () => Promise.resolve(tasks)
        });

        controller.findByUser(request, response).then(() => {
            expect(response._json).toEqual(tasks);
            done();
        }).catch(done);
    })

    test('given find tasks by user, when fail, then return error status 500', (done) => {
        const error = { code: 500 };

        const controller = new TaskController({
            findByUser: () => Promise.reject(error)
        });

        controller.findByUser(request, response).then(() => {
            expect(response._status).toEqual(500);
            done();
        }).catch(done);
    })

    test('given find tasks by user, when fail, then return error', (done) => {
        const error = { code: 500 };

        const controller = new TaskController({
            findByUser: () => Promise.reject(error)
        });

        controller.findByUser(request, response).then(() => {
            expect(response._json).toEqual(error);
            done();
        }).catch(done);
    })

    describe('given find task by uid', () => {

        test('given success, then return status 200', async () => {
            const controller = new TaskController({
                findByUid: () => Promise.resolve()
            });

            request.params.uid = 1;

            await controller.findByUid(request, response);

            expect(response._status).toEqual(200);
        })

        test('given success, then return task', async () => {
            const task = {
                findByUid: () => Promise.resolve()
            };

            const controller = new TaskController(task);

            request.params.uid = 1;

            await controller.findByUid(request, response);

            expect(response._json).toEqual(task);
        })

        test('when fail, then return error status', async () => {
            const task = {
                findByUid: () => Promise.reject({ code: 500 })
            };

            const controller = new TaskController(task);

            request.params.uid = 1;

            await controller.findByUid(request, response);

            expect(response._status).toEqual(500);
        })
        test('when fail, then return error status', async () => {
            const task = {
                findByUid: () => Promise.reject({ code: 500 })
            };

            const controller = new TaskController(task);

            request.params.uid = 1;

            await controller.findByUid(request, response);

            expect(response._json).toEqual({code: 500});
        });
    });

    describe('given create new task', () => {

        test('when success, then return status 200', async () => {
            const controller = new TaskController({
                create: () => Promise.resolve()
            });

            const request = {body: {}};
            const response = new ResponseMock();

            await controller.create(request, response);

            expect(response._status).toEqual(200);
        })

        test('then task should belong o user on request', async () => {
            const task = {
                create:() => Promise.resolve()
            };
            
            const controller = new TaskController(task);

            const request = {body: {}, user: {uid: "anyUserUid"}};
            const response = new ResponseMock();

            await controller.create(request, response);

            expect(response._json.user).toEqual({uid: "anyUserUid"});
        })

        test('when fail, then return error status', async () => {
            const controller = new TaskController({
                create: () => Promise.reject({code: 500})
            });

            const request = {body: {}};
            const response = new ResponseMock();

            await controller.create(request, response);

            expect(response._status).toEqual(500);
        })

        test('when fail, then return error', async () => {
            const controller = new TaskController({
                create: () => Promise.reject({code: 500})
            });

            const request = {body: {}};
            const response = new ResponseMock();

            await controller.create(request, response);

            expect(response._json).toEqual({code: 500});
        })
    })

    describe('given update task', () => {
        
        const user = {uid:"anyUserUid"};

        const request = {params: {uid:1}, user};
        let response;

        let model;

        beforeEach(() => {
            response = new ResponseMock();
            model = {
                _hasUpdated: false,
                update() {
                    this._hasUpdated = true;
                    return Promise.resolve();
                }
            };
        })

        test('when success, then return status 200', async () => {
            const controller = new TaskController(model);

            await controller.update(request, response);

            expect(response._status).toEqual(200);
        })

        test('when success, then return updated task', async () => {
            const controller = new TaskController(model);

            await controller.update(request, response);

            expect(response._json).toEqual(model);
        })

        test('then task should belong to user on request', async () => {
            const controller = new TaskController(model);

            await controller.update(request, response);

            expect(response._json.user).toEqual(user);
        })

        test('then task should have uid from request', async () => {
            const controller = new TaskController(model);

            await controller.update(request, response);

            expect(response._json.uid).toEqual(1);
        })

        test('the update task', async () => {
            const controller = new TaskController(model);

            await controller.update(request, response);

            expect(model._hasUpdated).toBeTruthy();
        })

        test('when fail, then return error status', async () => {
            const controller = new TaskController({
                update: () => Promise.reject({code: 500})
            });

            await controller.update(request, response);

            expect(response._status).toEqual(500);
        })
        test('when fail, then return error', async () => {
            const controller = new TaskController({
                update: () => Promise.reject({code: 500})
            });

            await controller.update(request, response);

            expect(response._json).toEqual({code: 500});
        })
    })

    describe('given remove task', () => {

        let request;
        let response;

        const model = {
            _hasDeleted: false,
            delete() {
                this._hasDeleted = true;
                return Promise.resolve();
            }
        }
        const user = {uid: "anyUserUid"};

        beforeEach(() => {
            request = {params: {uid: 1}, user};
            response = new ResponseMock();
        })

        test('when succes, then return status 200', async () => {
            const controller = new TaskController(model);

            await controller.delete(request, response);

            expect(response._status).toEqual(200);
        })

        test('then remove task', async () => {
            const controller = new TaskController(model);

            await controller.delete(request, response);

            expect(model._hasDeleted).toBeTruthy();
        })

        test('then task should belong to user from request', async () => {
            const controller = new TaskController(model);

            await controller.delete(request, response);

            expect(model.user).toEqual(user);
        })

        test('then task should have uid from request', async () => {
            const controller = new TaskController(model);

            await controller.delete(request, response);

            expect(model.uid).toEqual(1);
        })

        test('when error, then return error status', async () => {
            const controller = new TaskController({
                delete: () => Promise.reject({code: 500})
            });

            await controller.delete(request, response);

            expect(response._status).toEqual(500);
        })

        test('when error, then return error', async () => {
            const controller = new TaskController({
                delete: () => Promise.reject({code: 500})
            });

            await controller.delete(request, response);

            expect(response._json).toEqual({code: 500});
        })

    })


    class ResponseMock {
        _json = null;
        _status = 0;
        json(value) {
            this._json = value;
        }
        status(value) {
            this._status = value;
            return this;
        }
    }
});
