import { useState } from 'react';
import { functions } from 'config/firebase';

const BillingButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const redirectToBilling = async () => {
    setIsLoading(true);

    // Call function to create the Checkout session
    const stripeCreateBillingSession = functions.httpsCallable(
      'stripeCreateBillingSession'
    );
    const result = await stripeCreateBillingSession();
    const { url } = result.data;
    window.location = url;
  };

  return (
    <button className="rounded-md shadow" onClick={() => redirectToBilling()}>
      <a className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
        {isLoading ? 'Loading...' : 'Go to billing portal'}
      </a>
    </button>
  );
};

export default BillingButton;
