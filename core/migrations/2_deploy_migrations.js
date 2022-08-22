const Factory = artifacts.require("UniswapV2Factory.sol");
const CMU1 = artifacts.require("CMUToken.sol");
const CMU2 = artifacts.require("TartanToken.sol");

module.exports = async function (deployer, network, accounts) {

  // Deploying the factory
  await deployer.deploy(Factory, accounts[0]);
  const factory = await Factory.deployed();

  // Deploying the tokens
  await deployer.deploy(CMU1);
  const cmu1 = await CMU1.deployed();
  

  await deployer.deploy(CMU2);
  const cmu2 = await CMU2.deployed();

  cmu1Address = cmu1.address;
  cmu2Address = cmu2.address;
  
  // Creating the pairs
  await factory.createPair(cmu1Address, cmu2Address);
};
