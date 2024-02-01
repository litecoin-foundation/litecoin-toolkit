window.allNetworks = [
  {
    label: "rLTC, legacy, BIP32/44",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "rltc",
      bip32: { public: 0x043587cf, private: 0x04358394 },
      pubKeyHash: 111,
      scriptHash: 58,
      wif: 239,
      bip44: 0x01,
    },
  },
  {
    label: "rLTC, SegWit, BIP49",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "rltc",
      bip32: { public: 0x044a5262, private: 0x044a4e28 },
      pubKeyHash: 111,
      scriptHash: 58,
      wif: 239,
      bip44: 0x01,
    },
  },
  {
    label: "rLTC, Native SegWit, BIP84",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "rltc",
      bip32: { public: 0x045f1cf6, private: 0x045f18bc },
      pubKeyHash: 111,
      scriptHash: 58,
      wif: 239,
      bip44: 0x01,
    },
  },

  {
    label: "Testnet, legacy, BIP32/44",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "tltc",
      bip32: { public: 0x043587cf, private: 0x04358394 },
      pubKeyHash: 111,
      scriptHash: 58,
      wif: 239,
      bip44: 0x01,
    },
  },
  {
    label: "Testnet, SegWit, BIP49",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "tltc",
      bip32: { public: 0x044a5262, private: 0x044a4e28 },
      pubKeyHash: 111,
      scriptHash: 58,
      wif: 239,
      bip44: 0x01,
    },
  },
  {
    label: "Testnet, Native SegWit, BIP84",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "tltc",
      bip32: { public: 0x045f1cf6, private: 0x045f18bc },
      pubKeyHash: 111,
      scriptHash: 58,
      wif: 239,
      bip44: 0x01,
    },
  },
  {
    label: "Litecoin, legacy, BIP32/44 - SLIP44",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "ltc",
      bip32: { public: 0x019da462, private: 0x019d9cfe },
      pubKeyHash: 48,
      scriptHash: 50,
      wif: 176,
      bip44: 0x02,
    },
  },
  {
    label: "Litecoin, SegWit, BIP49 - SLIP44",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "ltc",
      bip32: { public: 0x01b26ef6, private: 0x01b26792 },
      pubKeyHash: 48,
      scriptHash: 50,
      wif: 176,
      bip44: 0x02,
    },
  },
  {
    label: "Litecoin, Native SegWit, BIP84 - SLIP44",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "ltc",
      bip32: { public: 0x01b26ef6, private: 0x01b26792 },
      pubKeyHash: 48,
      scriptHash: 50,
      wif: 176,
      bip44: 0x02,
    },
  },
  {
    label: "Litecoin, legacy, BIP32/44",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "ltc",
      bip32: { public: 0x0488b21e, private: 0x0488ade4 },
      pubKeyHash: 48,
      scriptHash: 50,
      wif: 176,
      bip44: 0x00,
    },
  },
  {
    label: "Litecoin, SegWit, BIP49",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "ltc",
      bip32: { public: 0x049d7cb2, private: 0x049d7878 },
      pubKeyHash: 48,
      scriptHash: 50,
      wif: 176,
      bip44: 0x00,
    },
  },
  {
    label: "Litecoin, Native SegWit, BIP84",
    config: {
      messagePrefix: "\u0019Litecoin Signed Message:\n",
      bech32: "ltc",
      bip32: { public: 0x04b24746, private: 0x04b2430c },
      pubKeyHash: 48,
      scriptHash: 50,
      wif: 176,
      bip44: 0x00,
    },
  },
];

window.bitcoinNetworks = _.filter(allNetworks, (n) => n.config.bech32 && (n.config.bip44 === 0x00 || n.config.bip44 === 0x01));

function customToWIF(keyPair, network) {
  return keyPair.toWIF();
}

function getP2PKHAddress(keyPair, network) {
  return bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: network }).address;
}

function getP2WPKHAddress(keyPair, network) {
  return bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: network }).address;
}

function getNestedP2WPKHAddress(keyPair, network) {
  const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: network });
  return bitcoin.payments.p2sh({ redeem: p2wpkh }).address;
}

function getP2TRAddress(keyPair, network) {
  const pubKey = bitcoin.ecurve.Point.decodeFrom(bitcoin.secp256k1, keyPair.publicKey);
  const taprootPubkey = bitcoin.schnorr.taproot.taprootConstruct(pubKey);
  const words = bitcoin.bech32.toWords(taprootPubkey);
  words.unshift(1);
  return bitcoin.bech32m.encode(network.bech32, words);
}

function calculateAddresses(keyPair, network) {
  keyPair.address = getP2PKHAddress(keyPair, network);
  if (network.bech32) {
    keyPair.nestedP2WPKHAddress = getNestedP2WPKHAddress(keyPair, network);
    keyPair.P2WPKHAddress = getP2WPKHAddress(keyPair, network);
    keyPair.P2TRAddress = getP2TRAddress(keyPair, network);
  }
}
