const AWS = require('aws-sdk');

// The important part!!!
const INTERNAL_HOST = 'host.docker.internal:4566';

const producer = async (event) => {
  console.log("PRODUCER INVOKED TO SEND MSG TO SQS QUEUE FROM ENDPOINT CALL, event = ");
// Set the region
  AWS.config.update({endpoint: 'http://' + INTERNAL_HOST, s3ForcePathStyle: true, region: 'localhost'});
// Create an SQS service object
  const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
  const params = {};
  let statusCode = 200;
  let message;

  let queueList;
  try {
    queueList = await sqs.listQueues(params).promise();
    console.log(queueList);

    const QueueUrl = 'https://' + INTERNAL_HOST + '/000000000000/workerQueue-local';

    await sqs
        .sendMessage({
          QueueUrl,
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
  }
  catch (error) {
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
