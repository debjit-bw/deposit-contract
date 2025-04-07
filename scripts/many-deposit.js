const { ethers } = require("ethers");
const Web3 = require("web3");
const web3 = new Web3();

// Replace these values
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const DEPOSIT_CONTRACT_PROXY = process.env.DEPOSIT_CONTRACT_PROXY;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const ABI = [
    {
        name: "batchDeposit",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "pubkeys", type: "bytes" },
            { name: "withdrawal_credentials", type: "bytes" },
            { name: "signatures", type: "bytes" },
            { name: "deposit_data_roots", type: "bytes32[]" },
            { name: "amounts", type: "uint256[]" }
        ],
        outputs: []
    },
    {
        name: "batchDeposit",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "pubkeys", type: "bytes" },
            { name: "withdrawal_credentials", type: "bytes" },
            { name: "signatures", type: "bytes" },
            { name: "deposit_data_roots", type: "bytes32[]" }
        ],
        outputs: []
    }
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)"
];

const deposit_data = require('./deposit-data.json')

function joinHex(args) {
    return '0x' + args.map(web3.utils.stripHexPrefix).join('')
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const min_deposit = '31250000000000000'; // 0.03125 GNO
const depositCount = 2;
const SPEND_AMOUNT = (BigInt(min_deposit) * BigInt(depositCount)).toString();

async function approve() {
    // Step 1: Approve token spending
    const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);
    const approveTx = await token.approve(DEPOSIT_CONTRACT_PROXY, SPEND_AMOUNT);
    console.log("Approve tx sent:", approveTx.hash);
    await approveTx.wait();
    console.log("Token approved");
}

async function deposit() {
    const pubkeys = []
    const signatures = []
    const deposit_data_roots = []
    const values = []

    for (let i = 0; i < depositCount; i++) {
        pubkeys.push(deposit_data[i].pubkey)
        signatures.push(deposit_data[i].signature)
        deposit_data_roots.push('0x' + deposit_data[i].deposit_data_root)
        values.push(min_deposit)
    }

    const pubkeysHex = joinHex(pubkeys)
    const withdrawal_credentialsHex = '0x' + deposit_data[0].withdrawal_credentials
    const signaturesHex = joinHex(signatures)

    const contract = new ethers.Contract(DEPOSIT_CONTRACT_PROXY, ABI, wallet);
    const tx = await contract.batchDeposit(
        pubkeysHex,
        withdrawal_credentialsHex,
        signaturesHex,
        deposit_data_roots,
        values,
    );
    console.log("Deposit tx sent:", tx.hash);
    await tx.wait();
    console.log("Deposit confirmed");
}

async function main() {
    await approve();
    await deposit();
}

main().catch(console.error);
