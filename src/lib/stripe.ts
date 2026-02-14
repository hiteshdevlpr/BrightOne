import Stripe from 'stripe';

/** Lazy Stripe client so build can succeed without STRIPE_SECRET_KEY (required only at runtime). */
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
    if (_stripe) return _stripe;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your environment.');
    }
    _stripe = new Stripe(key, { typescript: true });
    return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
    get(_, prop) {
        return (getStripe() as unknown as Record<string, unknown>)[prop as string];
    },
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
        const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);
        return {
            verified: true,
            status: pi.status,
            amount: pi.amount_received ?? pi.amount,
        };
    } catch {
        return { verified: false, status: 'unknown' };
    }
}
