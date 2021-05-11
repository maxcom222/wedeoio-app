// Initialize app as admin
import * as admin from 'firebase-admin';

admin.initializeApp();

// Export Storage and Firestore database and add custom settings
export const storage = admin.storage();
export const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

// Set environment variables
import * as functions from 'firebase-functions';
export const stripeTestKey = functions.config().stripe.test_key;
export const stripeSecretKey = stripeTestKey; // TODO Replace test key with production key
export const stripePublishableKey = functions.config().stripe.publishable_key;
export const stripeWebhookSecret = functions.config().stripe.webhook_secret;

// Define Stripe product ids. Used to in subscriptionStatus helper function to set isPro or isHobby on user document
export const hobbyProductId = functions.config().stripe.hobby_product_id;
export const proProductId = functions.config().stripe.pro_product_id;

// Initialize Stripe
import Stripe from 'stripe';
export const stripe = new Stripe(stripeSecretKey, { apiVersion: '2020-03-02' });

// Initialize Sendgrid
export const sendGridApiKey = functions.config().sendgrid.api_key;
export const welcomeTemplateId = functions.config().sendgrid
  .welcome_template_id;
export const teamInviteTemplateId = functions.config().sendgrid
  .team_invite_template_id;
export const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendGridApiKey);

// Initialize Algolia
const algoliasearch = require('algoliasearch').default;
export const algoliaAppId = functions.config().algolia.app_id;
export const algoliaApiKey = functions.config().algolia.api_key;
export const algoliaSearchKey = functions.config().algolia.search_key;
export const algoliaSearch = algoliasearch(algoliaAppId, algoliaApiKey);
