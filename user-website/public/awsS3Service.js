// awsS3Service.js
const { aws } = require('./connection');

const s3 = new aws.S3();

// Upload file to S3
async function uploadFile(bucketName, key, body) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body
  };
  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully at ${data.Location}`);
    return data;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
}

// Download file from S3
async function downloadFile(bucketName, key) {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  try {
    const data = await s3.getObject(params).promise();
    console.log(`File downloaded: ${key}`);
    return data.Body;
  } catch (err) {
    console.error('Error downloading file:', err);
    throw err;
  }
}

module.exports = {
  uploadFile,
  downloadFile
};