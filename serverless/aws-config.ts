// AWS Configuration 
// This would typically be loaded from environment variables

export const AWS_CONFIG = {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    // In a real app, these would be provided by the backend service
    // and not exposed in the frontend code
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    
    // DynamoDB table name
    userTableName: process.env.REACT_APP_DYNAMODB_TABLE || 'kultivo-users',
    
    // KMS key for encryption
    kmsKeyId: process.env.REACT_APP_KMS_KEY_ID,
    
    // API Gateway endpoints
    apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.kultivo.example.com',
  };