'use strict';

var qs = require('qs')

module.exports.contact = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var data = qs.parse(event.body);

  var name = data.name;
  var subject = data.subject;
  var email = data.email;
  var message = data.message;

  const response = {
    statusCode: 200,
    headers: {
      "x-custom-header" : "Contact Form Reply"
    },
    body: JSON.stringify({
      status: 'OK',
      name: name,
      subject: subject,
      email: email, 
      message: message}),
  };
  callback(null, response);
};
