var path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const walletService = require('../services/walletsservice');

const loadFullTransactionObject = () => {
  const bufferData = fs.readFileSync(
    path.join(__dirname, '..', 'data', 'transactions.json')
  );
  const stringData = bufferData.toString();
  return JSON.parse(stringData);
};

const loadTransactionsOfWalletId = (walletId) => {
  try {
    const bufferData = fs.readFileSync(
      path.join(__dirname, '..', 'data', 'transactions.json')
    );
    const stringData = bufferData.toString();
    const jsonDataNow = JSON.parse(stringData);
    return jsonDataNow[walletId];
  } catch (e) {
    console.log('Error >>', e);
    return [];
  }
};

const addTransactions = (walletId, amount, description) => {
  const loadTransaction = loadTransactionsOfWalletId(walletId);
  const balanceOfWallet = walletService.getWallet(walletId);

  const itemToSave = {
    id: uuid.v4(),
    walletId,
    amount,
    description,
    balance: balanceOfWallet.balance - amount,
    createdDate: new Date(),
  };

  loadTransaction.push(itemToSave);
  saveTransaction(walletId, loadTransaction);
  walletService.updateWalletBalance(walletId, balanceOfWallet.balance - amount);
  return itemToSave;
};

const saveTransaction = (walletId, transactions) => {
  const jsonData = transactions;
  const fullData = loadFullTransactionObject();
  fullData[walletId] = jsonData;

  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'transactions.json'),
    JSON.stringify(fullData)
  );
};

module.exports = {
  loadTransactionsOfWalletId,
  addTransactions,
  saveTransaction,
};
