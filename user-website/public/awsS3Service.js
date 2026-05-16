// awsS3Service.js
const { aws } = require('./connection');

const s3 = new aws.S3();

/**
 * Uploads a file to specified S3 bucket.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} key - The object key (file path/filename).
 * @param {Buffer|ReadableStream|string} body - The file content.
 * @returns {Object} - The response data from S3, including Location.
 */
async function uploadFile(bucketName, key, body) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body,
  };
  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully at ${data.Location}`);
    return data;
  } catch (err) {
    console.error(`Error uploading file to ${bucketName}/${key}:`, err);
    throw err;
  }
}

/**
 * Downloads a file from specified S3 bucket.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} key - The object key (file path/filename).
 * @returns {Buffer} - The body of the downloaded file.
 */
async function downloadFile(bucketName, key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  try {
    const data = await s3.getObject(params).promise();
    console.log(`File downloaded: ${bucketName}/${key}`);
    return data.Body;
  } catch (err) {
    console.error(`Error downloading file from ${bucketName}/${key}:`, err);
    throw err;
  }
}

module.exports = {
  uploadFile,
  downloadFile,
};