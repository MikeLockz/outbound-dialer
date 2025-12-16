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
        
        res.json({
          results: [
              {
                  result: `Processed function ${functionCall?.name}`
              }
          ]
        });
        return;
      }

      if (body.message.type === 'speech-update') {
        const transcriptService = req.app.get('transcriptService') as TranscriptService;
        if (transcriptService) {
          transcriptService.broadcast({
            type: 'transcript',
            call_id: body.message.call?.id,
            role: body.message.role,
            text: body.message.transcript,
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
