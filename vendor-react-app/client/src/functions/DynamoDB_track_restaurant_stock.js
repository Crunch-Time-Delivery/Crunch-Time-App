// Import AWS SDK
const AWS = require('aws-sdk');

// Initialize DynamoDB Document Client
const dynamo = new AWS.DynamoDB.DocumentClient();

// Table name from environment variables for flexibility
const TABLE_NAME = process.env.TABLE_NAME || 'RestaurantStock';

exports.handler = async (event) => {
  try {
    // Extract restaurantId from query parameters
    const restaurantId = event.queryStringParameters?.restaurantId;

    // Validate the presence of restaurantId
    if (!restaurantId || typeof restaurantId !== 'string' || restaurantId.trim() === '') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Missing or invalid restaurantId parameter' }),
      };
    }

    // Set DynamoDB get parameters
    const params = {
      TableName: TABLE_NAME,
      Key: {
        restaurant_id: restaurantId,
      },
    };

    // Fetch data from DynamoDB
    const data = await dynamo.get(params).promise();

    if (!data.Item) {
      // Restaurant not found
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Restaurant with ID ${restaurantId} not found` }),
      };
    }

    // Return stock information
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurantId: restaurantId,
        stock: data.Item.stock, // assuming 'stock' attribute exists
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