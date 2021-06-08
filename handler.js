//const {Endpoint} = require('aws-sdk');
const AWS = require('aws-sdk');
//const { AWS } = require("aws-sdk");

// const sqs = new SQS();
//const sqs = new AWS.SQS({endpoint: new Endpoint("http://localhost:4566"), region: "eu-west-1"});

const producer = async (event) => {

  console.log("PRODUCER INVOKED TO SEND MSG TO SQS QUEUE FROM ENDPOINT CALL, event = ");

// Set the region
  AWS.config.update({region: 'eu-west-1'});

// Create an SQS service object
  const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
  console.log(sqs);

  const params = {};

  let r;
  try {
    r = await sqs.listQueues(params).promise();
    console.log('ZZZZZZZZZZZZZ');
    console.log(r);
  }
  catch(e) {
    console.log('EEEEEEEEEEEE');
    console.log(e);
  }

  let statusCode = 200;
  let message;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  try {
    console.log('QUEUE_URL = ' + process.env.QUEUE_URL);
    // console.log(${LOCALSTACK_HOSTNAME});

    const queueUrl = `https://sqs.eu-west-1/000000000000/workerQueue-local`
    //
    // var params = {
    //   AWSAccountIds: [ /* required */
    //     'STRING_VALUE',
    //     /* more items */
    //   ],
    //   Actions: [ /* required */
    //     'STRING_VALUE',
    //     /* more items */
    //   ],
    //   Label: 'STRING_VALUE', /* required */
    //   QueueUrl: 'STRING_VALUE' /* required */
    // };
    // sqs.addPermission(params, function(err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else     console.log(data);           // successful response
    // });
    //let r = await sqs.addPermission(); //listQueues();
    //let r = await sqs.getQueueAttributes({QueueUrl: 'http://localhost:4566/000000000000/workerQueue-local'})
    console.log('xxxxxx')
    console.log(r);
    console.log('xxxxxx')
    await sqs
      .sendMessage({
        QueueUrl: `http://localhost:4566/000000000000/workerQueue-local`, //process.env.QUEUE_URL,
        MessageBody: event.body,
        MessageAttributes: {
          AttributeName: {
            StringValue: "Attribute Value",
            DataType: "String",
          },
        },
      })
      .promise();

    message = "Message accepted!";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

const consumer = async (event) => {
  console.log('CONSUMER INVOKED TO PROCESS MSG ON SQS QUEUE, first event = ' + JSON.stringify(event.Records[0]));

  for (const record of event.Records) {
    console.log("Message Body: ", record.body);
  }
};

module.exports = {
  producer,
  consumer,
};
