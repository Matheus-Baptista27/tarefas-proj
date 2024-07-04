import { BadRequestError } from "../../errors/bad-request.error";
import { validateTask } from "../create-task.validator";

describe('Create task validator', () => {

    let request;
    let response;

    beforeEach(() => {
        request = {
            body: {
                date: "2030-01-01",
                taskType: "anyTaskType",
                type: "open"
            }
        };
        response = new ResponseMock();
    });

    test('given date not informed, then return 400 error', () => {
        request.body.date = null;

        validateTask(request, response);

        expect(response._status).toEqual(400);
    });

    test('given date invalid, then return error', () => {
        request.body.date = "invalidDate";

        validateTask(request, response);

        expect(response._json).toBeInstanceOf(BadRequestError);
    });

    test('given task type not informed, then return 400 error', () => {
        request.body.taskType = null;

        validateTask(request, response);

        expect(response._status).toEqual(400);
    });

    test('given type not informed, then return 400 error', () => {
        request.body.type = null;

        validateTask(request, response);

        expect(response._status).toEqual(400);
    });

    test('given type is not open or closed, then return 400 error', () => {
        request.body.type = "anyOtherType";

        validateTask(request, response);

        expect(response._status).toEqual(400);
    });

    test('given task is valid, then go to next step', () => {
        let hasCalledNext = false;
        const next = () => { hasCalledNext = true; };

        validateTask(request, response, next);

        expect(hasCalledNext).toBeTruthy();
    });

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


/*import { BadRequestError } from "../../errors/bad-request.error";
import { validateTask } from "../create-task.validator";

describe('Create task validator', () =>{

    let request;
    let response;

    beforeEach(() => {
        request = {
        body: {
            date: "2030-01-01"
        },
        taskType: "anyTaskType",
        type: "open"
    };
        response = new ResponseMock();
    })

    test('given date not informed, then return 400 error', () => {
        request.body.date = null;

        validateTask(request, response);
        
        expect(response._status).toEqual(400);

    })

    test('given date not informed, then return error', () => {
        request.body.date = null;
        
        validateTask(request, response);
        
        expect(response._json).toBeInstanceOf(BadRequestError);

    })

    test('given date invalid, then return 400 error', () => {
        request.body.date = "invalidDate";

        validateTask(request, response);
        
        expect(response._status).toEqual(400);

    })

    test('given date not informed, then return 400 error', () => {
        request.body.date = null;

        validateTask(request, response);
        
        expect(response._status).toEqual(400);

    })

    test('given date invalid, then return error', () => {
        request.body.date = "invalidDate";

        validateTask(request, response);
        
        expect(response._json).toBeInstanceOf(BadRequestError);

    })

    test('given transaction type not informed, then return 400 error', () => {
        request.body.transactionType = null;

        validateTask(request, response);

        expect(response._status).toEqual(400);
    })

    test('given task type not informed, then return error', () => {
        request.body.transactionType = null;

        validateTask(request, response);

        expect(response._json).toBeInstanceOf(BadRequestError);
    })

    test('given type not informed, then return 400 error', () => {
        request.body.type = null;

        validateTask(request, response);

        expect(response._status).toEqual(400);
    })

    test('given type not informed, then return error', () => {
        request.body.type = null;

        validateTask(request, response);

        expect(response._json).toBeInstanceOf(BadRequestError);
    })

    test('given type is not open or closed, then return 400 error', () => {
        request.body.type = "anyOtherType";

        validateTask(request, response);

        expect(response._status).toEqual(400);
    })

    test('given type is not open or closed, then return error', () => {
        request.body.type = "anyOtherType";

        validateTask(request, response);

        expect(response._json).toBeInstanceOf(BadRequestError);
    })

    test('given task is valid, then go to next step', () => {
        let hasCalledNext = false;
        const next = () => {hasCalledNext = true;}

        validateTask(request, response, next);

        expect(hasCalledNext).toBeTruthy();
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
})*/