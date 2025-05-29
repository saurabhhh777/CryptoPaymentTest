import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import './index.css';
import App from './App.jsx';

function getLibrary(provider) {
  return new Web3Provider(provider);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </StrictMode>
);