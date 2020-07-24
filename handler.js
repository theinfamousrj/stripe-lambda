'use strict';

module.exports.health = async event => {
  const package = require('./package.json');
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Your lambda is running!',
        version: package.version,
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

module.exports.charge = async event => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const body = JSON.parse(event.body);
  
  return stripe.customers.create({ email: body.email })
    .then(customer => {
      return stripe.invoiceItems.create({
        customer: customer.id,
        amount: body.price,
        currency: body.currency,
        description: body.description,
      });
    })
    .then((invoiceItem) => {
      return stripe.invoices.create({
        collection_method: 'send_invoice',
        customer: invoiceItem.customer,
      });
    })
    .then(invoice => {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            invoice
          },
          null,
          2
        )
      }
    })
    .catch(error => console.error(error));
};
