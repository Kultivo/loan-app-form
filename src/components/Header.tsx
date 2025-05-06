import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        Thank you for choosing Kultivo!
      </h1>
      <p className="mt-4 text-gray-600 text-lg">
        You have been approved for a $300 wage advance, subject to you proving your income.
        Complete this form to open your account and access your cash advance.
        Payment is due on your next day you receive pay.
      </p>
    </header>
  );
};

export default Header;