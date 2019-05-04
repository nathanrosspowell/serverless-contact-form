'use strict';

const aws = require('aws-sdk');
const qs = require('qs');
const ses = new aws.SES();
const region = "<<{{MyRegionName}}>>";
const secretName = process.env.secret_manager_token;
const myEmail = "nathanrosspowell@gmail.com"; //process.env.secrets.EMAIL
const myDomain = "*"; //process.env.secrets.DOMAIN

function generateResponse (code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(payload)
  }
}

function generateError (code, err) {
  console.log(err)
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(err.message)
  }
}

function generateEmailParams (body) {
  const { name, subject, email, message } = qs.parse(body);
  console.log(name, subject, email, message);
  if (!(name && subject && email && message)) {
    throw new Error('Missing parameters! Make sure to add parameters, \'name\', \'subject\', \'email\' & \'message\'.')
  }

  console.log('myEmail:', myEmail, ", myDomain:", myDomain);
  console.log(process.env);
  return {
    Source: myEmail,
    Destination: { ToAddresses: [myEmail] },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `From: ${name}\nEmail: ${email}\nMessage: ${message}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `${name} has send you a message.`
      }
    }
  }
}

module.exports.contact = async (event) => {
  try {
    const emailParams = generateEmailParams(event.body)
    const data = await ses.sendEmail(emailParams).promise()
    return generateResponse(200, data)
  } catch (err) {
    return generateError(500, err)
  }
}