import { TaskNotFoundError } from '../errors/task-not-found.error.js';
import { TaskUidNotInformedError } from '../errors/task-uid-not-informed.error.js';
import { UserDoesntOwnTaskError } from '../errors/user-doesnt-own-task.error.js';
import { UserNotInformedError } from '../errors/user-not-informed.error.js';
import { Task } from '../model.js';

describe("Task model", () => {

    describe("given find user by uid", () => {

        let taskRepositoryMock;
        let model;

        beforeEach(() => {
            taskRepositoryMock = new TaskRepositoryMock();
            model = new Task(taskRepositoryMock);
        });

        test("when user is not informed, then return error 500", async () => {
            const response = model.findByUser();
            await expect(response).rejects.toBeInstanceOf(UserNotInformedError);
        });

        test("when user uid is not informed, then return error 500", async () => {
            model.user = {};
            const response = model.findByUser();
            await expect(response).rejects.toBeInstanceOf(UserNotInformedError);
        });

        test("when user is informed, then return transactions", async () => {
            model.user = { uid: "anyUserUid" };

            const tasks = [{ uid: "task1" }, { uid: "task2" }];
            taskRepositoryMock._response = Promise.resolve(tasks);

            const response = model.findByUser();
            await expect(response).resolves.toEqual(tasks);
        });

        describe('given find task by uid', () => {

            test('then return task', async () => {
                const model = new Task({
                    findByUid: () => Promise.resolve(createTask())
                });
                model.uid = 1;
                model.user = {uid: "anyUserUid"};

                await model.findByUid();

                expect(model).toEqual(createTask());
            });

            test('when user doesnt own task, then return 403 error', async () => {
                const taskDb = createTask();
                taskDb.user = { uid: "anyOtherUserUid" };

                const model = new Task({
                    findByUid: () => Promise.resolve(taskDb)
                });
                model.uid = 9;
                model.user = { uid: "anyUserUid" };

                await expect(model.findByUid()).rejects.toBeInstanceOf(UserDoesntOwnTaskError);
            });

            test('when uid not present, then return error 500', async () => {
                const model = new Task();

                await expect(model.findByUid()).rejects
                    .toBeInstanceOf(TaskUidNotInformedError);
            });

            test('when task not found, then return error 404', async () => {
                const model = new Task({
                    findByUid: () => Promise.resolve(null)
                });
                model.uid = 9;

                await expect(model.findByUid()).rejects
                    .toBeInstanceOf(TaskNotFoundError);
            });

        });

        describe('given create new task', () => {

            const params = {
                date: "anyDate",
                description: "anyDescription",
                taskType: "Academia",
                type: "open",
                user: {
                    uid: "anyUserUid"
                }
            };

            const repositoryMock = {
                _hasSaved: false,
                save() {
                    this._hasSaved = true;
                    return Promise.resolve({ uid: 1 });
                }
            };

            test('then return new task', async () => {
                const model = new Task(repositoryMock);

                await model.create(params);

                const newTask = createTask();

                expect(model).toEqual(newTask);
            });

            test('then save task', async () => {
                const model = new Task(repositoryMock);

                await model.create(params);

                expect(repositoryMock._hasSaved).toBeTruthy();
            });

        });

        describe('given update task', () => {

            let repositoryMock;

            beforeEach(() => {
                repositoryMock = {
                    _hasUpdated: false,
                    findByUid() {
                        return Promise.resolve({user: {uid:"anyUserUid"}});
                    },
                    update() {
                        this._hasUpdated = true;  
                        return Promise.resolve();
                    }
                }
            });

            test('then return update task', async () => {
                const model = new Task(repositoryMock);
                model.uid = 1;
                model.user = {uid: "anyUserUid"};

                const params = createTask();
                await model.update(params);

                const updatedTask = createTask();
                expect(model).toEqual(updatedTask);
            });
            
            test('then update task', async () => {
                const model = new Task(repositoryMock);
                model.uid = 1;
                model.user = {uid: "anyUserUid"};

                const params = createTask();
                await model.update(params);

                expect(repositoryMock._hasUpdated).toBeTruthy();  
            });

            test('when task doesnt belong to user, then return error', async () => {
                const model = new Task({
                    findByUid: () => Promise.resolve({user: {uid: "anyOtherUserUid"}})
                });
                model.uid = 1;
                model.user = {uid: "anyUserUid"};

                const params = createTask();
                await expect(model.update(params)).rejects.toBeInstanceOf(UserDoesntOwnTaskError);
            });

            test('when task doesnt exist, then return not found error', async () => {
                const model = new Task({
                    findByUid: () => Promise.resolve(null)
                });
                model.uid = 1;
                model.user = {uid: "anyUserUid"};

                const params = createTask();
                await expect(model.update(params)).rejects.toBeInstanceOf(TaskNotFoundError);
            });

        });

        describe('given delete task', () => {

            let repositoryMock;
    
            beforeEach(() => {
                repositoryMock = {
                    _hasDeleted: false,
                    delete() {
                        this._hasDeleted = true;
                        return Promise.resolve();
                    },
                    findByUid() {
                        return Promise.resolve({user: {uid: "anyUserUid"}});
                    }
                }
            })
    
            test('when success, then delete task', async () => {
                const model = new Task(repositoryMock);
                model.uid = "anyUid";
                model.user = {uid: "anyUserUid"};
    
                await model.delete();
    
                expect(repositoryMock._hasDeleted).toBeTruthy();
            })
    
            test('when task doesnt belong to user, then return error', async () => {
                const model = new Task(repositoryMock);
                model.uid = "anyUid";
                model.user = {uid: "anyOtherUserUid"};
    
                await expect(model.delete())
                    .rejects.toBeInstanceOf(UserDoesntOwnTaskError);
            })
    
            test('when task doesnt exist, then return error', async () => {
                const model = new Task({
                    findByUid: () => Promise.resolve(null)
                });
                model.uid = "anyUid";
                model.user = {uid: "anyOtherUserUid"};
    
                await expect(model.delete())
                    .rejects.toBeInstanceOf(TaskNotFoundError);
            })
    
        })

        function createTask() {
            const task = new Task();
            task.uid = 1;
            task.date = "anyDate";
            task.description = "anyDescription";
            task.taskType = "Academia";
            task.type = "open";
            task.user = {
                uid: "anyUserUid"
            };
            return task;
        }

        class TaskRepositoryMock {
            _response;
            findByUserUid() {
                return this._response;
            }
            findByUid() {
                return this._response;
            }
        }

    });

});
