import regionalFunctions from '../regionalFunctions';
import { db, stripe, stripeWebhookSecret } from '../config';
import { subscriptionStatus, getSubscription } from './subscriptions';
import { getUserByStripeId } from './customers';

const handleCheckoutSession = async (session: any): Promise<any> => {
  const stripeCustomerId = session.customer;
  const subscriptionId = session.subscription;
  const uid = session.client_reference_id;
  const subscription = await getSubscription(subscriptionId);
  const subData = subscriptionStatus(subscription);
  const docData = { ...subData, stripeCustomerId };

  await db.doc(`users/${uid}`).set(docData, { merge: true });

  return null;
};

const handleSubscriptionUpdated = async (subscription: any): Promise<any> => {
  const user = await getUserByStripeId(subscription.customer);
  const subData = subscriptionStatus(subscription);
  await db.doc(`users/${user.uid}`).set(subData, { merge: true });

  return null;
};

export const stripeWebhook = regionalFunctions.https.onRequest(
  async (request, response): Promise<any> => {
    const signature = request.headers['stripe-signature'] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        stripeWebhookSecret
      );
    } catch (error) {
      return response.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await handleCheckoutSession(session);
      return response.sendStatus(200);
    }

    // Handle the customer.subscription.updated and deleted event
    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      return response.sendStatus(200);
    }

    // Return a response to acknowledge receipt of the event
    return response.status(400).send({ received: true });
  }
);
