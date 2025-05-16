import { Router } from 'express';
import { signwellWebhookHandler } from '../controllers/webhookController';

const router = Router();

router.post('/signwell', signwellWebhookHandler);

export default router;