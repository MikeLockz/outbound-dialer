import { Request, Response } from 'express';
import { VapiService } from '../services/vapi';
import fs from 'fs';
import path from 'path';

const vapiService = new VapiService();

export class CallController {
  static async initiate(req: Request, res: Response) {
    try {
      const { target_number, license_plate, toll_bill_id, toll_date } = req.body;

      if (!target_number || !license_plate || !toll_bill_id || !toll_date) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      if (!/^\+[1-9]\d{1,14}$/.test(target_number)) {
        res.status(400).json({ error: 'Invalid phone number format' });
        return;
      }

      const promptPath = path.join(__dirname, '../prompts/toll-dispute.md');
      let system_prompt = fs.readFileSync(promptPath, 'utf-8');

      system_prompt = system_prompt
        .replace(/{{LICENSE_PLATE}}/g, license_plate)
        .replace(/{{TOLL_BILL_ID}}/g, toll_bill_id)
        .replace(/{{TOLL_DATE}}/g, toll_date);

      const result = await vapiService.initiateCall(target_number, system_prompt);
      res.json({ success: true, call_id: (result as any).id });
    } catch (error) {
      console.error(error);
      res.status(502).json({ error: 'Failed to initiate call', details: (error as Error).message });
    }
  }
}
