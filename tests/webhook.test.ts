import { Request, Response } from 'express';
import { WebhookController } from '../src/controllers/webhook';

describe('WebhookController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  it('should handle function-call event', () => {
    req.body = {
      message: {
        type: 'function-call',
        functionCall: {
          name: 'testFunction',
          parameters: { foo: 'bar' },
        },
        call: { id: 'call-123' },
      },
    };

    WebhookController.handle(req as Request, res as Response);

    expect(res.json).toHaveBeenCalled();
  });
});
