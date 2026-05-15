// Import AWS SDK
const AWS = require('aws-sdk');

// Initialize DynamoDB Document Client
const dynamo = new AWS.DynamoDB.DocumentClient();

// Table name where stock data is stored
const TABLE_NAME = 'RestaurantStock';

exports.handler = async (event) => {
  // Extract restaurantId from query parameters
  const restaurantId = event.queryStringParameters?.restaurantId;

  // Validate input
  if (!restaurantId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Missing required query parameter: restaurantId' }),
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Restaurant not found' }),
      };
    }

    // Return stock information
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurantId: restaurantId,
        stock: data.Item.stock, // assuming stock is stored as an attribute
      }),
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};