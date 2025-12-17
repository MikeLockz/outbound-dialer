import { Request, Response } from 'express';
import { PromptService } from '../services/prompt';
import { SimulationService } from '../services/simulation';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const simulationService = new SimulationService();

export class SimulationController {
    static async start(req: Request, res: Response) {
        try {
            const { license_plate, toll_bill_id, toll_date } = req.body;

            if (!license_plate || !toll_bill_id || !toll_date) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const systemPrompt = PromptService.getHydratedPrompt(license_plate, toll_bill_id, toll_date);
            res.json({ systemPrompt });
        } catch (error) {
            console.error('Simulation start error:', error);
            res.status(500).json({ error: 'Internal server error starting simulation' });
        }
    }

    static async chat(req: Request, res: Response) {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ error: 'Invalid messages format' });
            return;
        }

        try {
            const response = await simulationService.createCompletion(messages as ChatCompletionMessageParam[]);
            res.json({ response });
        } catch (error) {
            console.error('Simulation error:', error);
            res.status(500).json({ error: 'Failed to generate response' });
        }
    }
}
