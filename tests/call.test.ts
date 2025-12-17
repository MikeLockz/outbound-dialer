import { Request, Response } from 'express';
import { CallController } from '../src/controllers/call';
import { VapiService } from '../src/services/vapi';

// Mock VapiService
jest.mock('../src/services/vapi');
const mockVapiService = new VapiService();

describe('CallController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusSpy: jest.Mock;
  let jsonSpy: jest.Mock;

  beforeEach(() => {
    statusSpy = jest.fn().mockReturnThis();
    jsonSpy = jest.fn();
    mockResponse = {
      status: statusSpy,
      json: jsonSpy,
    };
    mockRequest = {};
    (VapiService as jest.Mock).mockClear();
    (mockVapiService.initiateCall as jest.Mock).mockClear();
  });

  it('should initiate a call successfully with valid data', async () => {
    mockRequest.body = {
      target_number: '+1234567890',
      system_prompt: 'Test prompt',
    };
    (mockVapiService.initiateCall as jest.Mock).mockResolvedValue({ id: 'call-id-123' });

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(mockVapiService.initiateCall).toHaveBeenCalledWith('+1234567890', 'Test prompt');
    expect(statusSpy).not.toHaveBeenCalled();
    expect(jsonSpy).toHaveBeenCalledWith({ success: true, call_id: 'call-id-123' });
  });

  it('should return 400 if target_number is missing', async () => {
    mockRequest.body = { system_prompt: 'Test prompt' };

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(mockVapiService.initiateCall).not.toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  it('should return 400 if system_prompt is missing', async () => {
    mockRequest.body = { target_number: '+1234567890' };

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(mockVapiService.initiateCall).not.toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  it('should return 400 if target_number is in an invalid format', async () => {
    mockRequest.body = {
      target_number: '12345',
      system_prompt: 'Test prompt',
    };

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(mockVapiService.initiateCall).not.toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Invalid phone number format' });
  });

  it('should return 502 if VapiService initiateCall fails', async () => {
    mockRequest.body = {
      target_number: '+1234567890',
      system_prompt: 'Test prompt',
    };
    (mockVapiService.initiateCall as jest.Mock).mockRejectedValue(new Error('Vapi error'));

    await CallController.initiate(mockRequest as Request, mockResponse as Response);

    expect(mockVapiService.initiateCall).toHaveBeenCalledWith('+1234567890', 'Test prompt');
    expect(statusSpy).toHaveBeenCalledWith(502);
    expect(jsonSpy).toHaveBeenCalledWith({ error: 'Failed to initiate call' });
  });
});
