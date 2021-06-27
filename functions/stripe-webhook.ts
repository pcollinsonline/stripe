/* eslint-disable @typescript-eslint/no-var-requires,import/prefer-default-export */
import { Handler } from '@netlify/functions';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const handler: Handler = async event => {
  const sig = event.headers['stripe-signature'];

  let jsonPayload;
  try {
    jsonPayload = stripe.webhooks.constructEvent(
      event.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err.message }),
    };
  }

  switch (jsonPayload.type) {
    case 'payment_intent.succeeded':
      console.log('PaymentIntent was successful!', jsonPayload.data.object);
      break;
    case 'payment_method.attached':
      console.log(
        'PaymentMethod was attached to a Customer!',
        jsonPayload.data.object
      );
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${jsonPayload.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};

export { handler };
