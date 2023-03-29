const express = require('express');
const router = express.Router();
const walletService = require('../services/walletsservice');
const transactionService = require('../services/transactionsservice');
const schema = require('../schema');

// Create new wallet
router.post('/', (req, res) => {
  const { error } = schema.walletSchema.validate(req.body);
  const { name, balance } = req.body;
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const walletCreated = walletService.addWallet(name, balance);
    res.status(201).json(walletCreated);
  } catch (error) {
    res.status(500).send('Error creating wallet');
  }
});

// Fetch wallet by ID
router.get('/:walletId', (req, res) => {
  const { walletId } = req.params;

  const wallet = walletService.getWallet(walletId);

  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }

  try {
    res.json(wallet);
  } catch (error) {
    res.status(500).send('Error fetching wallet');
  }
});

// Create transaction
router.post('/:walletId/transactions', (req, res) => {
  const { error } = schema.transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { walletId } = req.params,
    { amount, description } = req.body;

  try {
    const transactionCreated = transactionService.addTransactions(
      walletId,
      amount,
      description
    );
    res.json(transactionCreated);
  } catch (error) {
    res.status(500).send('Error creating transaction');
  }
});

// Fetch transactions for wallet
router.get('/:walletId/transactions', (req, res) => {
  const { walletId } = req.params;

  try {
    const getTransactions =
      transactionService.loadTransactionsOfWalletId(walletId);
    res.json(getTransactions);
  } catch (error) {
    res.status(500).send('Error getting transaction of wallet');
  }
});

module.exports = router;
