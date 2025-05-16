import { Request, Response } from 'express';
import { verifySignature } from '../services/signwell';

export const signwellWebhookHandler = (req: Request, res: Response) => {
    const signature = req.headers['x-signwell-signature'] as string;
    const payload = JSON.stringify(req.body);

    if (!verifySignature(payload, signature)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Received SignWell webhook event:', req.body);

    const eventType = req.body.event;
    switch (eventType) {
        case 'document.completed':
            handleDocumentCompleted(req.body);
            break;
        default:
            console.log(`Unhandled event type: ${eventType}`);
    }

    res.status(200).json({ success: true });
};

const handleDocumentCompleted = (eventData: any) => {
    console.log('Document signed:', eventData);
    // Dito mo ilalagay ang logic para i-save sa database o mag-send ng email
};