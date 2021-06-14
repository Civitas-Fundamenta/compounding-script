// Import Web3
const Web3 = require('web3');
// Import Contract ABIs
const abi = require('./abi.json');
// Init Web3 with remote RPC
const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
// Define Contract Addresses
const stakingAddress = '0x11Fe61999d17CC5Db98CAe0De6401B35268d2CeD';
// Init Contracts with web3
const staking = new web3.eth.Contract(abi, stakingAddress);
// Set Private Key - Add privateKey in Single Quotes Below
const privateKey = 'EXAMPLE_PRIVATE_KEY';

// Function run every 15 seconds
const timer = setInterval(function() {
  compoundReward();
}, 15 * 1000);

// Function to withdraw reward and execute swap
function compoundReward() {
  // Get TX
  web3.eth.getTransactionReceipt('ENTER_LAST_WITHDRAW_OR_COMPOUND_TX_HASH_HERE').then((resp) => {
    // Get Block Number TX was mined in
    web3.eth.getBlock('latest').then((block) => {
      // Do Math to work out blocks remaining
      const currentBlock = block.number;
      console.log(`Current Block: ${currentBlock}`);
      const atBlock = resp.blockNumber;
      console.log(`Transaction Block: ${atBlock}`);
      const blockRemaining = currentBlock - atBlock;
      console.log(`Blocks Passed: ${blockRemaining}`);
      console.log(`Blocks Remaining: ${(atBlock - currentBlock) + 28800}`);
      // Check if ready to withdraw
      if (blockRemaining > 28800) {
        // Define Method in contract to call
        const data = staking.methods.compoundRewards().encodeABI();
        // Create Tx
        const tx = {
          to: stakingAddress,
          data: data,
          gasPrice: 5000000000,
          gas: 82566,
        };
        // Sign Tx using privateKey
        web3.eth.accounts.signTransaction(tx, privateKey).then((raw) => {
          // Broadcast raw signed tx to network
          web3.eth.sendSignedTransaction(raw.rawTransaction).on('receipt', (result) => {
              // Console log Result of tx (Only if successful)
              console.log(result);
            // Catch errors
          }).catch((error) => {
            console.log(error);
          });
        });
        // If no errors, and all good, kill script after tx is mined by clearing our interval of 15 seconds
        clearInterval(timer);
      } else {
        // Not Ready to have rewards compounded
        console.log('Not Ready to claim');
      }
    })
  });
}