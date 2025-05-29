import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

// Initialize injected connector
const injected = new InjectedConnector({ 
  supportedChainIds: [1, 3, 4, 5, 42] // Mainnet + testnets
});

const WalletConnector = () => {
  const { activate, deactivate, active, account } = useWeb3React();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    setError('');
    try {
      await activate(injected);
    } catch (err) {
      console.error('Connection Error:', err);
      setError('Failed to connect. Please install MetaMask!');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
    } catch (err) {
      console.error('Disconnection Error:', err);
      setError('Failed to disconnect wallet.');
    }
  };

  return (
    <div className="mb-6">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      {active ? (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="font-mono text-sm">
              {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
            </span>
          </div>
          <button 
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            disabled={loading}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          onClick={connectWallet}
          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

const PaymentCard = ({ title, price, onPay }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mb-4">${price}</p>
      <button
        onClick={onPay}
        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition"
      >
        Pay Now
      </button>
    </div>
  </div>
);

const App = () => {
  const handlePay = (amount) => {
    alert(`Would process payment: ${amount}`);
    // Payment logic would go here
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white rounded-xl shadow-sm p-6 mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Crypto Payment Gateway</h1>
          <p className="text-gray-600 mt-2">Secure blockchain payments</p>
        </header>

        <WalletConnector />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PaymentCard 
            title="Basic Plan" 
            price="20" 
            onPay={() => handlePay('20 USDT')} 
          />
          <PaymentCard 
            title="Pro Plan" 
            price="100" 
            onPay={() => handlePay('100 USDT')} 
          />
          <PaymentCard 
            title="Enterprise" 
            price="500" 
            onPay={() => handlePay('500 USDT')} 
          />
        </div>
      </div>
    </div>
  );
};

export default App;