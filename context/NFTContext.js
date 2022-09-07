import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { MarketAddress, MarketAddressABI } from './constants';

// info needed to be sent to IPFS when sending request
const projectId = '2ELKxmXtRiTbhxxYo3Jr4399ZNf';
const projectSecret = 'f6a6a70e8c3773346ff7c23a25efe604';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
const options = {
  host: 'ipfs.infura.io',
  protocol: 'https',
  port: 5001,
  headers: {
    authorization: auth,
  },
};
const client = ipfsHttpClient(options);
// end point. Needed in next.config.js as well
const dedicatedEndPoint = 'https://nftartmarketplace.infura-ipfs.io';
// ------------------------------

// function to create contract when the seller or creator is passed in
const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

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

      const url = `${dedicatedEndPoint}/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.log('Error uploading file to IPFS: ', error);
    }
  };

  // function that will be called when the user wants to create a new NFT
  // called in createNFT() function
  const createSale = async (url, formInputPrice, isReselling, id) => {
    // set up the contract
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // who is making this NFT or sale
    const signer = provider.getSigner();
    // need to convert from number to Wei or Gwei
    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();

    const transaction = await contract.createToken(url, price, { value: listingPrice.toString() });

    await transaction.wait();
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) {
      return console.log('Missing form input values');
    }

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);
      // console.log(1);
      const url = `${dedicatedEndPoint}/ipfs/${added.path}`;
      // console.log(2);
      await createSale(url, price);
      // console.log(3);
      router.push('/');
    } catch (error) {
      console.log('Error uploading file to IPFS: ', error);
    }
  };

  // fetches all the NFTs from the smart contract
  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const data = await contract.fetchMarketItems();
    // fetch all NFT simultaneously
    // map to get data from each NFT
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      // get the metadata from the NFT url
      const { data: { image, name, description } } = await axios.get(tokenURI);
      // need to convert from number to Wei or Gwei
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      // returning an object of data of each specific NFT
      return {
        price,
        tokenid: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));
    // items will be an array of objects
    return items;
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    // set up the contract
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // who is making this NFT or sale
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data = type === 'fetchItemsListed'
      ? await contract.fetchItemsListed()
      : await contract.fetchMyNFTs();

    // map to get data from each NFT
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      // get the metadata from the NFT url
      const { data: { image, name, description } } = await axios.get(tokenURI);
      // need to convert from number to Wei or Gwei
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      // returning an object of data of each specific NFT
      return {
        price,
        tokenid: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    // items will be an array of objects
    return items;
  };

  // returning the provider to be used in the app
  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs, fetchMyNFTsOrListedNFTs }}>
      {children}
    </NFTContext.Provider>
  );
};
