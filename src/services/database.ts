import { UserRecord } from '../types';
import { AWS_CONFIG } from './aws-config';

/**
 * Save user data to the database using AWS API Gateway and Lambda
 * 
 * @param userData User data to save
 */
export const saveUserData = async (userData: UserRecord): Promise<void> => {
  try {
    // For development/preview - use localStorage as a fallback
    if (process.env.NODE_ENV === 'development' && !AWS_CONFIG.apiEndpoint) {
      console.log('DEV MODE: Saving user data to localStorage:', userData);
      localStorage.setItem(`user_${userData.vendorSpecificId}`, JSON.stringify(userData));
      return;
    }
    
    // Send data to AWS Lambda via API Gateway
    const response = await fetch(`${AWS_CONFIG.apiEndpoint}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save user data');
    }
    
    return;
  } catch (error) {
    console.error('Error saving to database:', error);
    
    // Still save to localStorage as a fallback in case of API failure
    // This is not ideal for production but ensures data isn't lost
    localStorage.setItem(`user_${userData.vendorSpecificId}`, JSON.stringify(userData));
    
    throw new Error('Failed to save user data to cloud database');
  }
};

/**
 * Get user data from the database using AWS API Gateway and Lambda
 * 
 * @param userId User ID to retrieve
 */
export const getUserData = async (userId: string): Promise<UserRecord | null> => {
  try {
    // For development/preview - use localStorage as a fallback
    if (process.env.NODE_ENV === 'development' && !AWS_CONFIG.apiEndpoint) {
      console.log('DEV MODE: Retrieving user data from localStorage');
      const userData = localStorage.getItem(`user_${userId}`);
      
      if (!userData) {
        return null;
      }
      
      return JSON.parse(userData) as UserRecord;
    }
    
    // Retrieve data from AWS Lambda via API Gateway
    const response = await fetch(`${AWS_CONFIG.apiEndpoint}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to retrieve user data');
    }
    
    const data = await response.json();
    return data as UserRecord;
  } catch (error) {
    console.error('Error retrieving from database:', error);
    
    // Try localStorage as fallback
    try {
      const userData = localStorage.getItem(`user_${userId}`);
      if (userData) {
        return JSON.parse(userData) as UserRecord;
      }
    } catch (e) {
      console.error('Fallback retrieval failed:', e);
    }
    
    return null;
  }
};