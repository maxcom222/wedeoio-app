import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { functions } from 'config/firebase';
import { useSelector } from 'react-redux';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutButton = ({ plan }) => {
  const user = useSelector((state: any) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const redirectToCheckout = async () => {
    setIsLoading(true);

    // Call function to create the Checkout session
    const stripeCreateCheckoutSession = functions.httpsCallable(
      'stripeCreateCheckoutSession'
    );
    const result = await stripeCreateCheckoutSession({
      email: user.email,
      priceId: plan.priceId,
    });
    const { id } = result.data;
    const stripe = await stripePromise;

    // When the customer clicks on the button, redirect them to Checkout.
    const { error } = await stripe.redirectToCheckout({
      sessionId: id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <button className="rounded-md shadow" onClick={redirectToCheckout}>
      <span className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
        {isLoading ? 'Loading...' : plan.title}
      </span>
    </button>
  );
};

export default CheckoutButton;
