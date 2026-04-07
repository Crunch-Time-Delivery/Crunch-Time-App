// src/aws-config.js
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'YOUR_REGION', // e.g., 'us-east-1'
  credentials: new AWS.Credentials('YOUR_ACCESS_KEY_ID', 'YOUR_SECRET_ACCESS_KEY'),
});

export const s3 = new AWS.S3();