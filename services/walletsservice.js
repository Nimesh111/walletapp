var path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const loadWallets = () => {
  try {
    const bufferData = fs.readFileSync(
      path.join(__dirname, '..', 'data', 'wallets.json')
    );
    const stringData = bufferData.toString();
    return JSON.parse(stringData);
  } catch (e) {
    return [];
  }
};

const getWallet = (walletId) => {
  try {
    const loadWallet = loadWallets();
    const [filterWallet] = loadWallet.filter(
      (wallet) => wallet.id === walletId
    );
    return filterWallet;
  } catch (e) {
    return null;
  }
};

const getWalletBalance = (walletId) => {
  const wallet = getWallet(walletId);
  return wallet.balance;
};

const updateWalletBalance = (walletId, newBalance) => {
  const loadWallet = loadWallets();

  // New Balance
  const walletData = getWallet(walletId);
  walletData.balance = newBalance;

  const filteredWallets = loadWallet.filter((wall) => wall.id !== walletId);
  filteredWallets.push(walletData);
  saveWallets(filteredWallets);
};

const addWallet = (name, balance) => {
  const loadWallet = loadWallets();
  const walletId = uuid.v4();
  const itemToSave = {
    id: walletId,
    name,
    balance: balance || 0,
    createdDate: new Date(),
  };

  loadWallet.push(itemToSave);
  saveWallets(loadWallet, walletId);
  return itemToSave;
};

const saveWallets = (walletDataToSave, walletId) => {
  const jsonData = JSON.stringify(walletDataToSave);
  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'wallets.json'),
    jsonData
  );
  if (walletId) createeWalletKeyInTransaction(walletId);
};

createeWalletKeyInTransaction = (walletId) => {
  const loadWallet = loadWallets();
  // Only carete wallet key in transaction for the first time.
  if (!(walletId in loadWallet)) {
    // Create Transactions array in transactions.json file with walletId
    const transBufferData = fs.readFileSync(
      path.join(__dirname, '..', 'data', 'transactions.json')
    );
    const transStringData = transBufferData.toString();
    const transJSONData = JSON.parse(transStringData);
    transJSONData[walletId] = [];
    fs.writeFileSync(
      path.join(__dirname, '..', 'data', 'transactions.json'),
      JSON.stringify(transJSONData)
    );
  }
};

module.exports = {
  loadWallets,
  getWallet,
  addWallet,
  saveWallets,
  updateWalletBalance,
  getWalletBalance,
};
