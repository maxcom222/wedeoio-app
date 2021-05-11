import Stripe from 'stripe';
import regionalFunctions from '../regionalFunctions';

import { catchErrors, getUID } from '../helpers';
import { stripe } from '../config';
import { getCustomerId } from './customers';

const createBillingSession = async (
  customer: string
): Promise<Stripe.BillingPortal.Session> => {
  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `https://app.wedeo.io/account/billing`,
  });

  return session;
};

export const stripeCreateBillingSession = regionalFunctions.https.onCall(
  async (_, context) => {
    const uid = getUID(context);
    const customer = await getCustomerId(uid);
    return catchErrors(createBillingSession(customer));
  }
);
