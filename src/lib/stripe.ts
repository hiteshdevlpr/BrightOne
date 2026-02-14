import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your .env.local file.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
});

/**
 * Verify a PaymentIntent with Stripe. Use this to derive payment status server-side;
 * never trust client-supplied paymentStatus.
 * @returns { verified, status } where status is from Stripe (e.g. 'succeeded', 'pending').
 */
export async function verifyPaymentIntent(paymentIntentId: string): Promise<{
    verified: boolean;
    status: string;
    amount?: number;
}> {
    try {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        return {
            verified: true,
            status: pi.status,
            amount: pi.amount_received ?? pi.amount,
        };
    } catch {
        return { verified: false, status: 'unknown' };
    }
}
