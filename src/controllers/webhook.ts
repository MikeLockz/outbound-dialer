import { Request, Response } from 'express';
import { VapiWebhookEvent } from '../types/vapi';
import { TranscriptService } from '../services/transcript';

export class WebhookController {
  static handle(req: Request, res: Response) {
    const body = req.body as VapiWebhookEvent;

    if (body.message) {
      if (body.message.type === 'function-call') {
        const { functionCall } = body.message;
        console.log('Function call received:', functionCall);

        if (functionCall?.name === 'complete_call') {
          console.log('Handling complete_call');
          res.json({
            results: [
              {
                result: 'Call completed successfully.',
              },
            ],
            ended: true,
          });
          return;
        }

        res.json({
          results: [
            {
              result: `Processed function ${functionCall?.name}`,
            },
          ],
        });
        return;
      }

      if (body.message.type === 'speech-update') {
        const transcriptService = req.app.get('transcriptService') as TranscriptService;
        if (transcriptService) {
          const role = body.message.role === 'user' || body.message.role === 'assistant' ? body.message.role : 'assistant';
          transcriptService.broadcast({
            type: 'transcript',
            role: role,
            content: body.message.transcript || '',
            timestamp: new Date().toISOString(),
          });
        }
        res.status(200).send('OK');
        return;
      }
    }

    res.status(200).send('OK');
  }
}
