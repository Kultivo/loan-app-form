'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const kms = new AWS.KMS();

// Helper function to encrypt sensitive data
const encryptData = async (data, keyId) => {
  const params = {
    KeyId: keyId,
    Plaintext: Buffer.from(JSON.stringify(data))
  };
  
  const result = await kms.encrypt(params).promise();
  return result.CiphertextBlob.toString('base64');
};

// Helper function to decrypt sensitive data
const decryptData = async (encryptedData) => {
  const params = {
    CiphertextBlob: Buffer.from(encryptedData, 'base64')
  };
  
  const result = await kms.decrypt(params).promise();
  return JSON.parse(result.Plaintext.toString());
};

module.exports.saveUser = async (event) => {
  try {
    const userData = JSON.parse(event.body);
    const timestamp = new Date().toISOString();
    
    // Encrypt sensitive user data
    const sensitiveData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      pin: userData.pin
    };
    
    const encryptedData = await encryptData(sensitiveData, process.env.KMS_KEY_ID);
    
    const params = {
      TableName: process.env.USERS_TABLE,
      Item: {
        vendorSpecificId: userData.vendorSpecificId,
        encryptedData: encryptedData,
        timestamp: timestamp
      }
    };
    
    await dynamoDb.put(params).promise();
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        vendorSpecificId: userData.vendorSpecificId,
        timestamp: timestamp
      })
    };
  } catch (error) {
    console.error('Error saving user data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Could not save user data' })
    };
  }
};

module.exports.getUser = async (event) => {
  try {
    const params = {
      TableName: process.env.USERS_TABLE,
      Key: {
        vendorSpecificId: event.pathParameters.id
      }
    };
    
    const result = await dynamoDb.get(params).promise();
    
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: 'User not found' })
      };
    }
    
    // Decrypt the sensitive data
    const decryptedData = await decryptData(result.Item.encryptedData);
    
    const responseData = {
      vendorSpecificId: result.Item.vendorSpecificId,
      ...decryptedData,
      timestamp: result.Item.timestamp
    };
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Could not retrieve user data' })
    };
  }
};