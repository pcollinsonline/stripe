/* eslint-disable @typescript-eslint/no-var-requires,import/prefer-default-export */
import { Handler } from '@netlify/functions';
import { CORS_HEADERS, Item, PRODUCTS } from './lib/utils';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handler: Handler = async event => {
  const jsonPayload = JSON.parse(event.body || '');
  const { items } = jsonPayload;

  const lineItems = items.map((item: Item) => {
    const product = PRODUCTS.find(productRef => productRef.id === item.id);
    if (!product) {
      throw Error(`no product mapped to id ${item.id}`);
    }
    const { quantity } = item;
    const { unitPrice, name, description } = product;
    return {
      quantity,
      price_data: {
        currency: 'usd',
        unit_amount: unitPrice,
        product_data: {
          name,
          description,
        },
      },
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CHECKOUT_SUCCESS_URL}?success=true`,
      cancel_url: `${process.env.CHECKOUT_CANCEL_URL}?canceled=true`,
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        id: session.id,
      }),
    };
  } catch (error) {
    // output to netlify function log
    // eslint-disable-next-line no-console
    console.error(error);

    // todo - could do something better here...
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

export { handler };
