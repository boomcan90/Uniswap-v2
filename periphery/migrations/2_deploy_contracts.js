const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol");

module.exports = async function (deployer) {
    const FACTORY_ADDRESS = "0xF4eCe9e074b401Bf76Ee72f1060eAa30aC3AA751";

    await deployer.deploy(WETH);
    const weth = await WETH.deployed();

    await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);
};
