# Prepare

```
git clone https://github.com/Civitas-Fundamenta/compounding-script.git
npm install
```

Now on line 12 enter your privateKey for the wallet which you stake with

On line 22, enter the last transaction has where you Created your stake/Withdrew Rewards/Compounded Rewards. This is important because this script checks every 15 seconds whether or not you can compound your rewards, if you use the wrong transaction has the compoundReward Function will trigger and the tx will revert OR you'll be waiting a very long time before the compoundReward function triggers. This script aims to compound as close to every 28800 blocks (24 hours) as possible to optimize your rewards.

Once this compoundReward is triggered the script is killed by clearInterval(timer) - at that point you need to replace the transaction hash on line 22 with the new transaction hash from the compound event, and restart the script. NOTE: if you do not replace the hash and restart the script it will call the compoundReward function and cause the TX to fail.

# To Run

```
node index.js
```
