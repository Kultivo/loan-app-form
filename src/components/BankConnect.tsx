import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserFormData } from '../types';

interface BankConnectProps {
  formData: UserFormData;
}

const BankConnect: React.FC<BankConnectProps> = ({ formData }) => {
  const navigate = useNavigate();

  const handleConnectBank = () => {
    // Store form data and UUID in session storage for use on the next page
    sessionStorage.setItem('formData', JSON.stringify(formData));
    
    // Navigate to the bank connection page with the UUID
    navigate(`/connect-bank/${formData.vendorSpecificId}`);
  };

  return (
    <div className="w-full py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect your bank</h2>
        <p className="text-gray-600">
          You're ready to complete sign up. We're going to ask to connect your bank accounts to
          verify your income. We use bank-level encryption and security to protect your data. We
          don't share data with third-parties.
        </p>
      </div>
      
      <button
        onClick={handleConnectBank}
        className="w-full bg-gray-900 text-white py-4 px-6 rounded flex items-center justify-center font-medium hover:bg-gray-800 transition-colors"
      >
        Sign up and connect my bank
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 ml-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        By signing up, you accept our{' '}
        <a href="#terms" className="text-blue-600 hover:underline">Terms of Use</a>
        {' '}and{' '}
        <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
      </p>
    </div>
  );
};

export default BankConnect;