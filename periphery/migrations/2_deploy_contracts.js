const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol");

module.exports = async function (deployer) {
    const FACTORY_ADDRESS = "0xDfF317cddfcC41d60B85366eC9f4EDAC86BC8707"

    await deployer.deploy(WETH);
    const weth = await WETH.deployed();

    await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);
};
