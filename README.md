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
blockchain is setup for us to deploy Uniswap V2. 

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

4. Next, run the command `truffle console`. This should connect to the ganache instance. 
   Within this shell, run the following commands: 

   ```js 
    UniswapV2Factory.deployed().then((x)=>{factory=x})
    factory.hash_code()
   ```

   Take note of the output of the second command. Leave this instance of terminal open
   as we would be interacting with this later once we have deployed the Router and have obtained
   it's address.

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
9. Next, we get two accounts to get 1 ETH worth of CMUToken and TartanToken. Refer to Homework 4 on how to do that. 
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