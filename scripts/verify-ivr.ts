
import { SimulationService } from '../src/services/simulation';
import { PromptService } from '../src/services/prompt';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function verifyIVR() {
    const simulationService = new SimulationService();

    const tollBillId = '123456789';
    const systemPrompt = PromptService.getHydratedPrompt(
        'ABC-1234',
        tollBillId,
        '2023-10-27'
    );

    console.log('--- Starting IVR Verification ---');

    // Scenario 1: Generic IVR
    console.log('\nTest Case 1: Generic IVR Menu');
    const messages1: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Thank you for calling the Toll Authority. Press 1 for payments, 2 for disputes, or stay on the line for the next available agent.' }
    ];

    console.log('User (IVR):', messages1[1].content);
    const response1 = await simulationService.createCompletion(messages1);
    console.log('Agent:', response1);

    const normalizedResponse1 = response1.toLowerCase();
    if (normalizedResponse1.includes('representative') ||
        normalizedResponse1.includes('operator') ||
        normalizedResponse1.includes('toll dispute') ||
        response1.includes('[DTMF: 2]')) {
        console.log('✅ PASS: Agent navigated correctly (asked for representative/dispute or pressed 2).');
    } else {
        console.log('❌ FAIL: Agent did not use expected keywords or DTMF options.');
    }

    // Scenario 2: Account Number Request
    console.log('\nTest Case 2: Account Number Request');
    const messages2: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please enter your Toll Billing ID followed by the pound sign.' }
    ];

    console.log('User (IVR):', messages2[1].content);
    const response2 = await simulationService.createCompletion(messages2);
    console.log('Agent:', response2);

    if ((response2.includes(tollBillId) || response2.includes(`[DTMF: ${tollBillId}#]`)) && response2.toLowerCase().includes('representative')) {
        console.log('✅ PASS: Agent provided ID and asked for representative.');
    } else if (response2.includes(tollBillId) || response2.includes(tollBillId.replace(/./g, (c) => `[DTMF: ${c}]`)) || response2.includes('DTMF')) {
        console.log('⚠️ PARTIAL: Agent provided ID but missed "Representative" keyword (check prompt logic).');
    } else {
        console.log('❌ FAIL: Agent did not provide Toll Billing ID.');
    }
}

verifyIVR().catch(console.error);
