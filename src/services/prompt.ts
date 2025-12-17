import fs from 'fs';
import path from 'path';

export class PromptService {
    static getHydratedPrompt(licensePlate: string, tollBillId: string, tollDate: string): string {
        const promptPath = path.join(__dirname, '../prompts/toll-dispute.md');
        let system_prompt = fs.readFileSync(promptPath, 'utf-8');

        system_prompt = system_prompt
            .replace(/{{LICENSE_PLATE}}/g, licensePlate)
            .replace(/{{TOLL_BILL_ID}}/g, tollBillId)
            .replace(/{{TOLL_DATE}}/g, tollDate);

        return system_prompt;
    }
}
