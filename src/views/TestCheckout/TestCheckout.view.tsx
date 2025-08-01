import {
  useStripe,
  useElements,
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export default function TestCheckoutView() {
  return (
    <div className='w-screen min-h-screen flex items-center justify-center bg-white'>
      <Elements
        stripe={stripePromise}
        options={{
          appearance: { theme: 'stripe' }
        }}
      >
        <TestCheckoutContent />
      </Elements>
    </div>
  );
}

function TestCheckoutContent() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const clientSecret =
    'pi_3NgZCjHYgol9aB5z0kGJt6sl_secret_QwiN8VqK8Z97MeB4Y8z6a6Abv'; // mock

  const handleSubmit = useCallback(async () => {
    const number = elements?.getElement(CardNumberElement);
    const expiry = elements?.getElement(CardExpiryElement);
    const cvc = elements?.getElement(CardCvcElement);

    if (!stripe || !number || !expiry || !cvc) {
      alert('Stripe não carregado corretamente');
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: number
      }
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      navigate('/checkout-success');
    }
  }, [stripe, elements, clientSecret, navigate]);

  return (
    <div className='w-full max-w-sm bg-white p-6 rounded-2xl space-y-5'>
      <label className='text-sm text-gray-600'>Card number</label>
      <div className='p-2 bg-white border border-gray-300 rounded-md'>
        <CardNumberElement
          options={{ style: { base: { fontSize: '16px' } }, disableLink: true }}
        />
      </div>

      <div className='flex gap-4'>
        <div className='flex-1'>
          <label className='text-sm text-gray-600'>Expiry date</label>
          <div className='p-2 bg-white border border-gray-300 rounded-md'>
            <CardExpiryElement
              options={{ style: { base: { fontSize: '16px' } } }}
            />
          </div>
        </div>
        <div className='flex-1'>
          <label className='text-sm text-gray-600'>CVC / CVV</label>
          <div className='p-2 bg-white border border-gray-300 rounded-md'>
            <CardCvcElement
              options={{ style: { base: { fontSize: '16px' } } }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md'
      >
        Pay
      </button>
    </div>
  );
}
