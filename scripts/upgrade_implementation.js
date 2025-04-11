const Web3 = require('web3');
const web3 = new Web3();

module.exports = async function (callback) {
  try {
    const newImplementationAddress = '0x49dE1aced385334F1a66d86Db363264eB5b6A708';

    const proxyUpgradeAbi = {
      name: 'upgradeTo',
      type: 'function',
      inputs: [
        {
          type: 'address',
          name: '_implementation',
        },
      ],
    };

    const calldata = web3.eth.abi.encodeFunctionCall(proxyUpgradeAbi, [newImplementationAddress]);
    console.log('Calldata for upgradeTo():', calldata);

    callback();
  } catch (err) {
    callback(err);
  }
};

// CALLDATA: 0x3659cfe600000000000000000000000049de1aced385334f1a66d86db363264eb5b6a708