'use strict';

module.exports.health = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Your lambda is running!',
        version: '',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.create = async event => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  return stripe.customers.create({ email: 'customer@example.com' })
    .then(customer => {
      console.log('here');
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            customerID: customer.id,
            input: event
          },
          null,
          2
        )
      }
    })
    .catch(error => console.error(error));
};
