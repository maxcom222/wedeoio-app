import regionalFunctions from '../regionalFunctions';
import Stripe from 'stripe';
import { catchErrors, getUID } from '../helpers';
import { stripe } from '../config';
import { getCustomerId } from './customers';

interface Subscription {
  isPro: boolean;
  isHobby: boolean;
  subscriptionActive: boolean;
  subscription: {
    status: string;
    id: string;
    amount: any;
    cancelAtPeriodEnd?: boolean;
    currentPeriodEnd?: any;
    currency?: string;
    nickname?: string | null;
    priceId?: string;
    trialPeriodDays?: number | null;
    product?: string | Stripe.Product | Stripe.DeletedProduct | null;
  };
}

/**
 * subscriptionStatus is a helper function that returns a object of subscription info
 * @param  {Stripe.Subscription} subscription
 * @returns subscription
 */
export const subscriptionStatus = (
  subscription: Stripe.Subscription
): Subscription => {
  return {
    subscriptionActive: subscription.status === 'active',
    isPro:
      subscription.plan?.product === 'prod_HZuU1aPAqyJI2D' &&
      subscription.status === 'active',
    isHobby:
      subscription.plan?.product === 'prod_HXISyTxcEgcoch' &&
      subscription.status === 'active',
    subscription: {
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: subscription.current_period_end,
      id: subscription.id,
      product: subscription.plan?.product,
      status: subscription.status,
      amount: subscription.plan?.amount,
      currency: subscription.plan?.currency,
      nickname: subscription.plan?.nickname,
      priceId: subscription.plan?.id,
      trialPeriodDays: subscription.plan?.trial_period_days,
    },
  };
};

/**
 * getSubscription will return the Stripe subscriptions of the given subscription ID
 * @param  {string} uid
 */
export const getSubscription = async (
  subId: string
): Promise<Stripe.Subscription> => {
  return stripe.subscriptions.retrieve(subId);
};

/**
 * getSubscriptions will return a list of Stripe subscriptions of the customer
 * that is found by the given UID
 * @param  {string} uid
 */
export const getSubscriptions = async (
  uid: string
): Promise<Stripe.ApiList<Stripe.Subscription>> => {
  const customer = await getCustomerId(uid);
  return stripe.subscriptions.list({ customer });
};

/**
 * stripeGetSubscriptions is a callable cloud function to get the list of subscriptions
 * of the user with the given UID
 * @param {string} uid
 */
export const stripeGetSubscriptions = regionalFunctions.https.onCall(
  async (_, context) => {
    const uid = getUID(context);
    return catchErrors(getSubscriptions(uid));
  }
);
