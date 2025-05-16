import crypto from 'crypto';

const SIGNWELL_SECRET = process.env.SIGNWELL_SECRET || 'your_signwell_secret';

export const verifySignature = (payload: string, signature: string): boolean => {
    const hmac = crypto.createHmac('sha256', SIGNWELL_SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    return signature === expectedSignature;
};