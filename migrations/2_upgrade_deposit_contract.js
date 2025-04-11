const fs = require('fs')
const SBCDepositContract = artifacts.require('SBCDepositContract')

module.exports = async function (deployer, network, accounts) {
  if (network !== 'test' && network !== 'soliditycoverage') {
    const token_address = "0x19C653Da7c37c66208fbfbE8908A5051B57b4C70";

    const runtime_bytecode = SBCDepositContract.bytecode
    // store the runtime bytecode of the contract
    fs.writeFileSync(
        `./scripts/bytecodes/runtime_bytecode_${network}_${SBCDepositContract.address}.json`,
        JSON.stringify({ SBCDepositContract: runtime_bytecode }, null, 2)
    )

    const constructor_bytecode = SBCDepositContract.deployedBytecode
    // store the constructor bytecode of the contract
    fs.writeFileSync(
        `./scripts/bytecodes/constructor_bytecode_${network}_${SBCDepositContract.address}.json`,
        JSON.stringify({ SBCDepositContract: constructor_bytecode }, null, 2)
    )

    // deploy new implementation with new constructor
    await deployer.deploy(SBCDepositContract, token_address)
    const newImplementation = await SBCDepositContract.deployed()
    console.log("New implementation deployed at: ", newImplementation.address)
  }
}
