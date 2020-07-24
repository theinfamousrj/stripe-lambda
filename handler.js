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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.create = async event => {
  import Stripe from 'stripe';
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  stripe.customers.create({
    email: 'customer@example.com',
  })
    .then(customer => {
      return {
        statusCode: 200,
        body: JSON.stringify({
          customerID: customer.id,
          input: event
        })
      }
    })
    .catch(error => console.error(error));
};
