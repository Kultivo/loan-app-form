import React, { useState } from 'react';
import Header from '../components/Header';
import UserForm from '../components/UserForm';
import BankConnect from '../components/BankConnect';
import { UserFormData } from '../types';
import { saveUserData } from '../services/database';

const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleFormSubmit = async (data: UserFormData) => {
    // Save form data to state
    setFormData(data);
    setIsFormSubmitted(true);
    
    try {
      // Save to database
      await saveUserData({
        ...data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving user data:', error);
      // You might want to add error handling UI here
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Header />
      
      <div className="mt-6">
        <UserForm onFormSubmit={handleFormSubmit} />
        
        {isFormSubmitted && formData && (
          <BankConnect formData={formData} />
        )}
      </div>
    </div>
  );
};

export default LandingPage;