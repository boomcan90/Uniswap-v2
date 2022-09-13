# Uniswap V2 deployment assignment

This repository contains the codebase required for deploying an instance of Uniswap V2
on a local Ganache instance. This is based off of the Uniswap V2 [core](https://github.com/Uniswap/v2-core)
and [periphery](https://github.com/Uniswap/v2-periphery) repositories.

## Instructions

1. Download a copy of this repository on your machine. This can either be done
through `git` (by using the command `git clone https://github.com/boomcan90/Uniswap-v2.git`)
or by clicking on the Code button, then the Download Zip button, and then extracting
the zip file to a location of your choice. Open a terminal in this folder, and 
keep it open as we will be using this later. For the rest of these instructions, 
`$DIR` will refer to this directory that contains the `core` and `periphery` folders.

2. Open Ganache, and set up a new ethereum workspace. Give the workspace a memorable
name. Under the "Chain" option, ensure that the 
hardfork is set to "Muir Glacier". Click on "Save Workspace". Wait for the accounts
to deploy with 100ETH each. This can take some time. Once complete, the Ganache 
blockchain is setup for us to deploy Uniswap V2. While we have been importing the `truffle-config.js` for the other projects, we are not doing that in this instance, since that has issues with slowing down Ganache once the contracts are deployed. 

3. Going back to the terminal instance, run the following commands: 
   ```sh
    cd core
    truffle migrate --reset
    ```

    Within this output, we want to take note of the following: 

    1. UniswapV2Factory Contract Address
    2. UniswapV2ERC20 Contract Address
    3. CMUToken Contract Address
    4. TartanToken Contract Address
  
   As a part of this, we are deploying the Factory and it's requirements - one of them being the [UniswapV2Pair.sol](core/contracts/UniswapV2Pair.sol) contract. This defines the way that an arbitrary ERC20 token can be transferred for another arbitrary ERC20 token.

4. Next, run the command `truffle console`. This should connect to the ganache instance. 
   Within this shell, run the following commands: 

   ```js 
    UniswapV2Factory.deployed().then((x)=>{factory=x})
    factory.hash_code()
   ```

   Take note of the output of the second command. Leave this instance of terminal open
   as we would be interacting with this later once we have deployed the Router and have obtained
   it's address. This does validation of the contract. This is a security measure added into the Router to ensure that the only Pair contract that the router is communicating with is the one that it is expecting. 

5. Open the `periphery` folder in your preferred text editor. Once in this folder, we
   need to edit a few files. The first one is `$DIR/periphery/contracts/libraries/UniswapV2Library.sol`.
   This file defines the common functions used by various Uniswap contracts, but has a 
   hardcoded address for the UniswapV2Pair hashcode. This hardcoded value needs to be replaced
   by the value we obtained earlier in step 4. In order to do this, replace the
   contents of line 24 between the apostrophe's with the value copied in step 4.
   Due to the changes in formatting, the initial `0x` that is present in the output copied
   would need to be deleted.

6. The other file that needs to be changed is `$DIR/periphery/migrations/2_deploy_contracts.js`
   In this file, replace the `FACTORY_ADDRESS` variable with the UniswapV2Factory Contract 
   Address noted in Step 3.

7. Open a terminal in the `periphery` folder, and run the following: 
   ```sh
   npm i
   truffle migrate
   ```

   Within this output, take note of the following:

   1. UniswapV2Router02 Contract Address

8. We would also need to authorize the router to be able to make deposits and withdrawals
from the CMUToken and TartanTokens. This can be done by running the following commands within the core `truffle console` instance that we have running:
    ```js
    router = "<Address copied in Step 7>"
    CMUToken.deployed().then((x)=>{cmutoken=x})
    TartanToken.deployed().then((x)=>{tartantoken=x})
    cmutoken.approve(router, "1000000000000000000000", {from: accounts[1]})
    cmutoken.approve(router, "1000000000000000000000", {from: accounts[2]})
    tartantoken.approve(router, "1000000000000000000000", {from: accounts[1]})
    tartantoken.approve(router, "1000000000000000000000", {from: accounts[2]})
    ```
9. Next, we get two accounts to get 1 ETH worth of CMUToken and TartanToken. In this case, we are going to be using the second and third accounts created in Ganache. The ERC20 contracts can be found [here](core/contracts/CMUToken.sol) and [here](core/contracts/TartanToken.sol). In order to purchase the tokens, a call to the default function is needed. This would be done in a manner similar to the one covered in the [code walkthrough](https://github.com/mm6/ethereum-code-walkthrough_1). To use web3, use the `periphery` instance of `truffle console`.
10. For a UniSwapV2 contract to be able to swap tokens, it needs to be able to have the necessary amount of liquidity of both tokens to be able to swap the tokens for each other. This can be done by running the following commands in the `periphery`'s `truffle console` instance:
    ```js
    UniswapV2Router02.deployed().then((x)=>{router=x})
    cmutokenadd = "<CMU Token address copied in step 3>"
    tartantokenadd = "<Tartan Token address copied in step 3>"
    router.addLiquidity(cmutokenadd, tartantokenadd, "100000000000000000000", "100000000000000000000", 10000, 10000, accounts[1], new Date().getTime()+100, {from: accounts[1]})
    ```
11. Lastly, to do a swap for CMUTokens, run the following commands: 
    ```js
    router.swapTokensForExactTokens("10000000000000000000", "20000000000000000000", [cmutokenadd, tartantokenadd], accounts[2], new Date().getTime()+100, {from:accounts[2]})
    ```


### Metamask

As a part of [Lab 1](https://github.com/mm6/ethereum-lab1), metamask was one of the dependencies that was installed. We would be using this to get a visual feedback on the transactions. 

Metamask is a wallet extension added into the web-browser of choice. 

1. Click on the MetaMask plugin in your browser. There is a circle icon on the top right that is the "Accounts" icon. Click this icon and open "Settings". Under "Advanced", set "Advanced Gas Controls" to "ON". Also, set "Show Conversion on Testnets" to "ON".

2. At this point, a new network needs to be added to metamask. Metamask ships with a default "Localhost 8545" network, but this is not compatible with Ganache out of the box. We need to delete this network and add it with the correct settings to get it to work. Under "Settings" > "Networks", click on "Localhost 8545" and then on "Delete". Confirm Deleting the Network by pressing the red button.

3. Click on the Add a network button on the top right. Under "Network Name" enter Ganache, under "New RPC URL" enter http://127.0.0.1:7545, under "ChainID" enter 1337, and under Currency Symbol enter "ETH" and then select "Save". You will now be able to import accounts from Ganache. Always ensure that you are working with the "Custom RPC" network and not any other networks in MetaMask.

   To see an expanded view of your wallet, click on the "Account Options" ellipsis to the right of the account and click on "Expand View".

   Currently, your account name is "Account 1" and you control 0 ETH. To complete transactions through the wallet, you will import accounts from Ganache into your MetaMask wallet as "imported" accounts. In Ganache, you can view the key icon to the right of the public key of each account, click on the key icon of the second account and you can view the private key of the account. Copy the private key and use it for importing the account into MetaMask.

   In the expanded view of MetaMask, click on the "My Accounts" image on the top right, and select "Import Account", select "Private Key" from the dropdown menu and paste the copied private key from the previous step. Click on "Import" and you have successfully imported a Ganache account to your MetaMask Wallet. You now control 100 ETH from "Account 2". Use the same method to add "Account 3", which corresponds to the third account from Ganache. 

4. In MetaMask, expand the view of the first account and click on "Add Tokens" to add the CMU Token to the account. Click on "Custom Token" and paste the copied address in the "Step 3" and click on "Add Custom Token", and then click on "Import Tokens". You have now successfully added CMU Tokens to your  account. Do the same step for TartanToken for the same account; and for the other imported account.
