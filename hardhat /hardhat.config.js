require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("hardhat-abi-exporter");

const { PRIVATE_KEY, POLYGONSCAN_API_KEY, ETHERSCAN_API_KEY } = process.env;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        mumbai: {
            url: `https://matic-mumbai.chainstacklabs.com`,
            accounts: [PRIVATE_KEY],
        },
        rinkeby: {
            url: `https://rinkeby-light.eth.linkpool.io`,
            accounts: [PRIVATE_KEY],
        },
    },
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    etherscan: {
        apiKey: POLYGONSCAN_API_KEY,
    },
    mocha: {
        timeout: 200000,
    },
    abiExporter: {
        path: "../src/abi",
        runOnCompile: true,
    },
};
