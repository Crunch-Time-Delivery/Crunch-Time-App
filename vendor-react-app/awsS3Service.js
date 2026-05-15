// awsS3Service.js
const { aws } = require('./connection');

const s3 = new aws.S3();

/**
 * Uploads a file to the specified S3 bucket.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} key - The key (path/filename) for the uploaded file.
 * @param {Buffer | ReadableStream | string} body - The file content.
 * @returns {Object} - The data returned from S3 upon successful upload.
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
 * Downloads a file from the specified S3 bucket.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} key - The key (path/filename) of the file to download.
 * @returns {Buffer} - The file contents.
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