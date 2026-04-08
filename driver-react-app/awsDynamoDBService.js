// awsDynamoDBService.js
const { aws } = require('./connection');

const dynamoDb = new aws.DynamoDB.DocumentClient();

// Put item into DynamoDB
async function putItem(tableName, item) {
  const params = {
    TableName: tableName,
    Item: item
  };
  try {
    await dynamoDb.put(params).promise();
    console.log(`Item inserted into ${tableName}`);
  } catch (err) {
    console.error('Error inserting item:', err);
    throw err;
  }
}

// Get item from DynamoDB
async function getItem(tableName, key) {
  const params = {
    TableName: tableName,
    Key: key
  };
  try {
    const data = await dynamoDb.get(params).promise();
    return data.Item;
  } catch (err) {
    console.error('Error fetching item:', err);
    throw err;
  }
}

module.exports = {
  putItem,
  getItem
};