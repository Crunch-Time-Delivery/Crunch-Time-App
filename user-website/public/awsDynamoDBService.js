// awsDynamoDBService.js
const { aws } = require('./connection');

const dynamoDb = new aws.DynamoDB.DocumentClient();

/**
 * Insert or replace an item in DynamoDB table.
 * @param {string} tableName - The name of the DynamoDB table.
 * @param {Object} item - The item to put into the table.
 * @returns {Promise<void>}
 */
async function putItem(tableName, item) {
  const params = {
    TableName: tableName,
    Item: item,
  };
  try {
    await dynamoDb.put(params).promise();
    console.log(`Item successfully inserted into ${tableName}`);
  } catch (err) {
    console.error(`Error inserting item into ${tableName}:`, err);
    throw err;
  }
}

/**
 * Fetch an item from DynamoDB table by primary key.
 * @param {string} tableName - The name of the DynamoDB table.
 * @param {Object} key - The primary key of the item.
 * @returns {Object|null} - The retrieved item or null if not found.
 */
async function getItem(tableName, key) {
  const params = {
    TableName: tableName,
    Key: key,
  };
  try {
    const data = await dynamoDb.get(params).promise();
    if (data.Item) {
      console.log(`Item retrieved from ${tableName}`);
      return data.Item;
    } else {
      console.log(`No item found in ${tableName} for key:`, key);
      return null;
    }
  } catch (err) {
    console.error(`Error fetching item from ${tableName}:`, err);
    throw err;
  }
}

module.exports = {
  putItem,
  getItem,
};