import { Request, Response } from 'express';
import { CallController } from '../src/controllers/call';
import { VapiService } from '../src/services/vapi';

// Mock VapiService
jest.mock('../src/services/vapi', () => {
  const mInitiateCall = jest.fn();
  const MockVapiService = jest.fn().mockImplementation(() => {
    return {
      initiateCall: mInitiateCall,
    };
  });
  // Attach spy to the class mock to access it in tests
  (MockVapiService as any).mockInitiateCall = mInitiateCall;
  return {
    VapiService: MockVapiService,
  };
});

jest.mock('../src/services/prompt', () => ({
  PromptService: {
    getHydratedPrompt: jest.fn().mockReturnValue('Hydrated System Prompt'),
  },
}));
import { PromptService } from '../src/services/prompt';

describe('CallController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusSpy: jest.Mock;
  let jsonSpy: jest.Mock;
  let mockInitiateCall: jest.Mock;

  beforeEach(() => {
    mockInitiateCall = (VapiService as any).mockInitiateCall;
    statusSpy = jest.fn().mockReturnThis();
    jsonSpy = jest.fn();
    mockResponse = {
      status: statusSpy,
      json: jsonSpy,
    };
    mockRequest = {};
    mockInitiateCall.mockClear();
    (PromptService.getHydratedPrompt as jest.Mock).mockClear();
  });

  it('should initiate a call successfully with valid data', async () => {
    mockRequest.body = {
      target_number: '+1234567890',
      license_plate: 'ABC1234',
      toll_bill_id: 'BILL999',
      toll_date: '2023-10-01',
    };
    (PromptService.getHydratedPrompt as jest.Mock).mockReturnValue('Hydrated System Prompt');
    mockInitiateCall.mockResolvedValue({ id: 'call-id-123' });

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(PromptService.getHydratedPrompt).toHaveBeenCalledWith('ABC1234', 'BILL999', '2023-10-01');
    expect(mockInitiateCall).toHaveBeenCalledWith('+1234567890', 'Hydrated System Prompt');
    expect(statusSpy).not.toHaveBeenCalled();
    expect(jsonSpy).toHaveBeenCalledWith({ success: true, call_id: 'call-id-123' });
  });

  it('should return 400 if target_number is missing', async () => {
    mockRequest.body = {
      license_plate: 'ABC1234',
      toll_bill_id: 'BILL999',
      toll_date: '2023-10-01',
    };

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(mockInitiateCall).not.toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  it('should return 400 if missing other required fields', async () => {
    mockRequest.body = { target_number: '+1234567890' };
    // Missing license_plate, toll_bill_id, toll_date

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(mockInitiateCall).not.toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  it('should return 400 if target_number is in an invalid format', async () => {
    mockRequest.body = {
      target_number: '12345',
      license_plate: 'ABC1234',
      toll_bill_id: 'BILL999',
      toll_date: '2023-10-01',
    };

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(mockInitiateCall).not.toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Invalid phone number format' });
  });

  it('should return 502 if VapiService initiateCall fails', async () => {
    mockRequest.body = {
      target_number: '+1234567890',
      license_plate: 'ABC1234',
      toll_bill_id: 'BILL999',
      toll_date: '2023-10-01',
    };
    (PromptService.getHydratedPrompt as jest.Mock).mockReturnValue('Hydrated System Prompt');
    mockInitiateCall.mockRejectedValue(new Error('Vapi error'));

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(mockInitiateCall).toHaveBeenCalledWith('+1234567890', 'Hydrated System Prompt');
    expect(statusSpy).toHaveBeenCalledWith(502);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Failed to initiate call', details: 'Vapi error' });
  });
});
