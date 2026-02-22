/**
 * Shared booking payment logic for /booking and /book flows.
 */

export interface CreatePaymentIntentBody {
    selectedPackageId: string | null;
    selectedAddOns: string[];
    propertySize?: string;
    preferredPartnerCode?: string;
    /** Total including HST in cents (sidebar "Total Due") – server uses this when it matches its own calculation */
    totalWithTaxCents?: number;
}

export interface CreatePaymentIntentResult {
    clientSecret: string;
    amount: number;
}

export async function createPaymentIntent(
    body: CreatePaymentIntentBody
): Promise<CreatePaymentIntentResult> {
    const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            selectedPackageId: body.selectedPackageId,
            selectedAddOns: body.selectedAddOns,
            propertySize: body.propertySize,
            preferredPartnerCode: body.preferredPartnerCode,
            ...(body.totalWithTaxCents != null && body.totalWithTaxCents >= 50 && { totalWithTaxCents: body.totalWithTaxCents }),
        }),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
    }

    return {
        clientSecret: data.clientSecret,
        amount: data.amount,
    };
}
