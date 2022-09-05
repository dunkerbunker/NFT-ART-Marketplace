import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { MarketAddress, MarketAddressABi } from './constants';

// info needed to be sent to IPFS when sending request
const projectId = '2ELKxmXtRiTbhxxYo3Jr4399ZNf';
const projectSecret = 'f6a6a70e8c3773346ff7c23a25efe604';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
const options = {
  host: 'ipfs.infura.io',
  protocol: 'https',
  port: 5001,
  apiPath: '/ipfs/api/v0',
  headers: {
    authorization: auth,
  },
};
const dedicatedEndPoint = 'https://nftartmarketplace.infura-ipfs.io';
const client = ipfsHttpClient(options);

// Create a context which is simpler solution than Redux
// used when less data is needed to be shared
export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'ETH';

  // function that checks if metamask is installed and connected
  // runs everytime the page loads
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask first.');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No authorized account found');
      alert('Please connect to MetaMask.');
    }
  };

  // useEffect to run checkIfWalletIsConnected function when the page loads
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // function to connect metamask
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask first.');

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // function that uploads to IPFS
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });

      const url = `${dedicatedEndPoint}${added.path}`;

      return url;
    } catch (error) {
      console.log('Error uploading file to IPFS: ', error);
    }
  };

  // returning the provider to be used in the app
  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS }}>
      {children}
    </NFTContext.Provider>
  );
};
