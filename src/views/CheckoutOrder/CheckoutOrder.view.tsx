import {
  useStripe,
  useElements,
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { FaLock } from 'react-icons/fa';

export default function CheckoutOrderView() {
  const [searchParams] = useSearchParams();

  const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''
  );

  const requiredParams = [
    'orderId',
    'accountId',
    'celebrityId',
    'paymentAccountId',
    'baseAmount',
    'cardRegion'
  ];

  const isInvalid = requiredParams.some(param => !searchParams.get(param));

  if (isInvalid) {
    return (
      <div className='text-red-600 text-center mt-10'>
        Unable to process your request at this time.
      </div>
    );
  }

  return (
    <div className='w-screen min-h-screen flex flex-col items-center pt-4 bg-white'>
      <Elements
        stripe={stripePromise}
        options={{ appearance: { theme: 'stripe' } }}
      >
        <CheckoutOrderContent />
      </Elements>
    </div>
  );
}

function CheckoutOrderContent() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    const number = elements?.getElement(CardNumberElement);
    if (!stripe || !number) {
      alert('Payment system not load correct');
      return;
    }

    try {
      setLoading(true);

      const pmRes = await stripe.createPaymentMethod({
        type: 'card',
        card: number
      });

      if (pmRes.error || !pmRes.paymentMethod?.id) {
        throw new Error(
          pmRes.error?.message || 'Failed to create payment method'
        );
      }

      const dto = {
        orderId: searchParams.get('orderId')!,
        accountId: searchParams.get('accountId')!,
        celebrityId: searchParams.get('celebrityId')!,
        paymentAccountId: searchParams.get('paymentAccountId')!,
        baseAmount: Number(searchParams.get('baseAmount')),
        cardRegion: searchParams.get('cardRegion') as 'eu' | 'intl',
        discountPercent: Number(searchParams.get('discountPercent') ?? 0),
        extras: JSON.parse(searchParams.get('extras') ?? '{}'),
        paymentMethodId: pmRes.paymentMethod.id /* paymentMethodId */
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/veripay/pay/intent`,
        dto,
        {
          headers: {
            apikey: import.meta.env.VITE_API_KEY ?? ''
          }
        }
      );

      /* const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: number }
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        navigate('/checkout-success');
      } */

      if (data?.status === 'requires_action' && data?.clientSecret) {
        const result = await stripe.confirmCardPayment(data.clientSecret);
        if (result.error) {
          throw new Error(result.error.message);
        }
      }

      navigate('/checkout-success');
    } catch (err) {
      console.error(err);
      alert('Error processing payment');

      navigate('/checkout-error');
    } finally {
      setLoading(false);
    }
  }, [stripe, elements, searchParams, navigate]);

  const content = {
    cardNumberContent: searchParams.get('cardNumberContent') ?? 'Card number',
    expiryContent: searchParams.get('expiryContent') ?? 'Expiry',
    payContent: searchParams.get('payContent') ?? 'Pay'
  };

  return (
    <div className='w-full max-w-sm bg-white px-4 space-y-6 flex flex-col justify-between'>
      <div>
        <label className='text-sm text-gray-600'>
          {content.cardNumberContent}
        </label>
        <div className='p-4 border border-gray-300 rounded-md'>
          <CardNumberElement
            options={{ style: { base: { fontSize: '16px' } } }}
          />
        </div>
      </div>

      <div className='flex gap-4'>
        <div className='flex-1'>
          <label className='text-sm text-gray-600'>
            {content.expiryContent}
          </label>
          <div className='p-4 border border-gray-300 rounded-md'>
            <CardExpiryElement
              options={{ style: { base: { fontSize: '16px' } } }}
            />
          </div>
        </div>
        <div className='flex-1'>
          <label className='text-sm text-gray-600'>CVC</label>
          <div className='p-4 border border-gray-300 rounded-md'>
            <CardCvcElement
              options={{ style: { base: { fontSize: '16px' } } }}
            />
          </div>
        </div>
      </div>

      <Button
        className='w-full text-white font-medium py-3 rounded-md mt-4 flex items-center justify-center gap-2 h-[50px] text-base'
        isLoading={loading}
        onClick={handleSubmit}
      >
        <FaLock size={16} />
        {content.payContent}
      </Button>
    </div>
  );
}
