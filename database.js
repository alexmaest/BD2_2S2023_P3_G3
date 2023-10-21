const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAQCYIQHPPRDBZPP7B',
    secretAccessKey: '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',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();


module.exports = dynamoDB;
