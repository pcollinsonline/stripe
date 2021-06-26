/* eslint-disable @typescript-eslint/no-var-requires,import/prefer-default-export */
import { Handler } from '@netlify/functions';
import { PRODUCTS, Item, CORS_HEADERS } from './lib/utils';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items: Item[]): number => {
  return items.reduce((accum, item) => {
    const { id, quantity } = item;
    const match = PRODUCTS.find(product => product.id === id);
    const cost = match ? match.unitPrice * quantity : 0;
    return accum + cost;
  }, 0);
};

const handler: Handler = async event => {
  const jsonPayload = JSON.parse(event.body || '');
  const { items } = jsonPayload;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
  });

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ clientSecret: paymentIntent }),
  };
};

export { handler };
