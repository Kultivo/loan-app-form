import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserFormData } from '../types';

const ConnectBankPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve form data from session storage
    const storedData = sessionStorage.getItem('formData');
    
    if (!storedData) {
      setError('Form data not found. Please return to the previous page.');
      setIsLoading(false);
      return;
    }

    try {
      const parsedData = JSON.parse(storedData) as UserFormData;
      setFormData(parsedData);
      
      // Validate the UUID from URL matches the one in form data
      if (id !== parsedData.vendorSpecificId) {
        setError('Invalid session. Please try again.');
        setIsLoading(false);
        return;
      }

      // Create the iframe URL with form data
      const baseUrl = 'https://banks-staging.talefin.com/v1/i/kultivo';
      const successUrl = encodeURIComponent(`${window.location.origin}/success`);
      
      const url = `${baseUrl}/${parsedData.vendorSpecificId}/banks?` +
        `firstName=${encodeURIComponent(parsedData.firstName)}` +
        `&lastName=${encodeURIComponent(parsedData.lastName)}` +
        `&email=${encodeURIComponent(parsedData.email)}` +
        `&phoneNumber=${encodeURIComponent(parsedData.phoneNumber)}` +
        `&collect=account_owner&collect=analysis` +
        `&success_url=${successUrl}`;
      
      setIframeUrl(url);
      setIsLoading(false);
    } catch (err) {
      console.error('Error parsing form data:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }, [id]);

  const handleGoBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <p className="text-xl">Loading bank connection interface...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={handleGoBack}
            className="bg-gray-900 text-white py-2 px-6 rounded font-medium hover:bg-gray-800"
          >
            Return to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Connect Your Bank Account</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {iframeUrl && (
          <iframe
            src={iframeUrl}
            title="Bank Connection"
            className="w-full h-screen min-h-[800px] border-none"
            allow="camera *; microphone *"
          />
        )}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={handleGoBack}
          className="text-gray-600 hover:text-gray-900 underline"
        >
          Cancel and return to form
        </button>
      </div>
    </div>
  );
};

export default ConnectBankPage;