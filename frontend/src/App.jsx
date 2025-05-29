import React, { useMemo, useCallback } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import {
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

const RECIPIENT_ADDRESS = "6dSHCBmZMKoDJFY3AjrhjBEUYyE3PVL6T3EPGYyxyLky";

const PayButton = ({ amount }) => {
  const { publicKey, sendTransaction, connected } = useWallet();

  const handlePay = useCallback(async () => {
    if (!connected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const connection = new Connection(clusterApiUrl("testnet"));

      const recipientPubkey = new PublicKey(RECIPIENT_ADDRESS);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");

      alert(`Payment successful! Tx signature: ${signature}`);
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message || "unexpected error"}`);
    }
  }, [publicKey, sendTransaction, connected, amount]);

  return (
    <button
      onClick={handlePay}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Pay {amount} SOL
    </button>
  );
};

const Card = ({ title, price }) => (
  <div className="border border-gray-300 rounded-lg p-5 w-40 text-center shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    <p className="text-xl mb-4">{price} SOL</p>
    <PayButton amount={price} />
  </div>
);

const WalletSection = () => (
  <div className="flex justify-end mb-10 gap-3">
    <WalletMultiButton />
    <WalletDisconnectButton />
  </div>
);

const App = () => {
  const network = WalletAdapterNetwork.Testnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="p-5 font-sans">
            <WalletSection />
            <div className="flex justify-center gap-6">
              <Card title="Small Payment" price={0.01} />
              <Card title="Monthly Subscription" price={0.1} />
              <Card title="One-time Fee" price={0.05} />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
