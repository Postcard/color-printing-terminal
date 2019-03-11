var AWS = require('aws-sdk');

var sqs = new AWS.SQS({
  region: process.env.AWS_SQS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var QueueUrl = null;
sqs.getQueueUrl({
  QueueName: process.env.SQS_QUEUE_NAME
}, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    QueueUrl = data.QueueUrl;
  }
});


function pushToPrinter(MessageBody){
  sqs.sendMessage({
    QueueUrl: QueueUrl,
    MessageBody: JSON.stringify(MessageBody)
  }, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Sent!", data)
    }
  });
}

module.exports = {push: pushToPrinter};
