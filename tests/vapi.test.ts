import { VapiService } from '../src/services/vapi';
import { VapiClient } from '@vapi-ai/server-sdk';

jest.mock('@vapi-ai/server-sdk');

describe('VapiService', () => {
  let vapiService: VapiService;
  let mockVapiClient: any;

  beforeEach(() => {
    mockVapiClient = {
      calls: {
        create: jest.fn(),
      },
      phoneNumbers: {
        list: jest.fn(),
      },
    };
    (VapiClient as unknown as jest.Mock).mockReturnValue(mockVapiClient);
    vapiService = new VapiService();
  });

  it('should initiate a call successfully', async () => {
    const mockResponse = { id: 'call-123', status: 'queued' };
    mockVapiClient.phoneNumbers.list.mockResolvedValue([{ id: 'phone-123' }]);
    mockVapiClient.calls.create.mockResolvedValue(mockResponse);

    const result = await vapiService.initiateCall('+1234567890', 'Hello');
    expect(result).toEqual(mockResponse);
    expect(mockVapiClient.calls.create).toHaveBeenCalledWith(expect.objectContaining({
      phoneNumberId: 'phone-123',
      customer: expect.objectContaining({
        number: '+1234567890'
      }),
      assistant: expect.objectContaining({
        model: expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: 'Hello'
            })
          ])
        })
      })
    }));
  });
});
