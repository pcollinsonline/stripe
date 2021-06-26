/* eslint-disable @typescript-eslint/no-var-requires */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const utils = require('./lib/utils');

const handler = async event => {
  const {
    body: { items },
  } = event;

  const lineItems = items.map(item => {
    const product = utils.PRODUCTS.find(
      productRef => productRef.id === item.id
    );
    const { unitPrice, name, description, quantity } = product;
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
      headers: utils.CORS_HEADERS,
      body: {
        id: session.id,
      },
    };
  } catch (error) {
    // output to netlify function log
    // eslint-disable-next-line no-console
    console.error(error);

    // todo - could do something better here...
    return {
      statusCode: 500,
      headers: utils.CORS_HEADERS,
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

module.exports = { handler };
