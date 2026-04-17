// Import AWS SDK
const AWS = require('aws-sdk');

// Initialize DynamoDB Document Client
const dynamo = new AWS.DynamoDB.DocumentClient();

// Table name where stock data is stored
const TABLE_NAME = 'RestaurantStock';

exports.handler = async (event) => {
  // Expecting restaurant ID or name as a query parameter
  const restaurantId = event.queryStringParameters?.restaurantId;

  if (!restaurantId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing restaurantId parameter' }),
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      restaurant_id: restaurantId,
    },
  };

  try {
    const data = await dynamo.get(params).promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Restaurant not found' }),
      };
    }

    // Return stock information
    return {
      statusCode: 200,
      body: JSON.stringify({
        restaurantId: restaurantId,
        stock: data.Item.stock, // assuming stock is stored as an attribute
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching stock data' }),
    };
  }
};