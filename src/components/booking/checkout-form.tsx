'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import ErrorMsg from '../error-msg';

interface CheckoutFormProps {
    onSuccess: (paymentIntentId: string) => void;
    onCancel: () => void;
    amount: number;
}

export default function CheckoutForm({ onSuccess, onCancel, amount }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL is required but we'll prevent redirect if possible or handle it
                return_url: window.location.origin + '/booking/confirmation',
            },
            redirect: 'if_required', // Attempt to avoid redirect
        });

        if (error) {
            setErrorMessage(error.message || 'An error occurred with your payment.');
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        } else {
            // Unexpected state, maybe processing
            setErrorMessage('Unexpected payment status: ' + (paymentIntent?.status || 'unknown'));
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <h4 className="mb-4" style={{ color: '#ffffff' }}>Secure Payment</h4>
            <div className="mb-4">
                <p className="mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Amount due:</p>
                <h3 style={{ color: '#ffffff' }}>${(amount / 100).toFixed(2)}</h3>
            </div>

            <PaymentElement />

            {errorMessage && (
                <div className="mt-3">
                    <ErrorMsg msg={errorMessage} />
                </div>
            )}

            <div className="d-flex gap-3 mt-4">
                <button
                    type="button"
                    className="tp-btn-black-2"
                    onClick={onCancel}
                    disabled={isProcessing}
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white'
                    }}
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="tp-btn-black-2 booking-btn-primary"
                    disabled={!stripe || isProcessing}
                >
                    {isProcessing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
                </button>
            </div>
        </form>
    );
}
