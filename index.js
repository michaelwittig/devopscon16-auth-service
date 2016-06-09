"use strict";

var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();

function generatePolicy(principalId, effect, resource) {
  return {
    "principalId": principalId,
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [{
        "Action": "execute-api:Invoke",
        "Effect": effect,
        "Resource": resource
      }]
    }
  };
}

exports.handler = function(event, context, cb) {
  console.log(JSON.stringify(event));
  var token = event.authorizationToken;
  dynamodb.getItem({
    "Key": {
      "token": {
        "S": token
      }
    },
    "TableName": "auth-token"
  }, function(err, data) {
    if (err) {
      cb(err);
    } else {
      if (data.Item === undefined) {
        cb(null, generatePolicy('user', 'Deny', event.methodArn));
      } else {
        cb(null, generatePolicy('user', 'Allow', event.methodArn));
      }
    }
  });
};
