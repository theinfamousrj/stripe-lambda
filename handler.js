'use strict';

module.exports.health = async event => {
  const pack = require('./package.json');
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Your lambda is running!',
        version: pack.version,
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.create = async event => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const body = JSON.parse(event.body);
  
  return stripe.customers.create({ email: body.email })
    .then(customer => {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            customerID: customer.id,
            email: body.email,
            input: event
          },
          null,
          2
        )
      }
    })
    .catch(error => console.error(error));
};

module.exports.intent = async event => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const body = JSON.parse(event.body);
  
  return stripe.customers.create({ email: body.email })
    .then(customer => {
      return stripe.paymentIntents.create({
        customer: customer.id,
        amount: body.price,
        currency: body.currency,
        description: body.description,
        receipt_email: body.email,
        payment_method_types: ['card'],
      });
    })
    .then(intent => {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            intent
          },
          null,
          2
        )
      }
    })
    .catch(error => console.error(error));
};
