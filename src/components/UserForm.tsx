import React, { useState, useEffect } from 'react';
import PinInput from './PinInput';
import { UserFormData, UserDataApiResponse } from '../types';
import { fetchUserData } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

interface UserFormProps {
  onFormSubmit: (data: UserFormData) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    pin: '',
    vendorSpecificId: uuidv4() // Generate a UUID when the form is created
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Attempt to prefill form data from API when component mounts
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        // Extract any query parameters from URL that might contain user identification
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        
        if (userId) {
          const userData = await fetchUserData(userId);
          // Update form with any data returned from API
          setFormData(prevData => ({
            ...prevData,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePinChange = (pin: string) => {
    setFormData(prevData => ({
      ...prevData,
      pin
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  if (isLoading) {
    return <div className="w-full flex justify-center py-8">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete your details</h2>
        <p className="text-gray-600">Your name and contact details to set up your account</p>
      </div>

      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-800 font-medium mb-2">
          First Name (as shown on ID)
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Enter your first name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-800 font-medium mb-2">
          Surname (as shown on ID)
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Enter your surname"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-800 font-medium mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Enter your phone number"
          required
        />
      </div>

      <PinInput onChange={handlePinChange} />
    </form>
  );
};

export default UserForm;