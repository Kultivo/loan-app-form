import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ConnectBankPage from './pages/ConnectBankPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connect-bank/:id" element={<ConnectBankPage />} />
        <Route path="/success" element={<div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Success!</h1>
          <p className="text-xl">Your bank account has been connected successfully.</p>
          <p className="mt-4">Your advance will be processed shortly.</p>
        </div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;