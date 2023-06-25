import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "hardhat-deploy";
import "hardhat-deploy-ethers";
import 'dotenv/config';

const SEPOLIA_RPC_URL: string = process.env.SEPOLIA_RPC_URL || '';
const PRIVATE_KEY: string = process.env.PRIVATE_KEY || '';
const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY || '';
const COINMARKET_API_KEY: string = process.env.COINMARKET_API_KEY || '';

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.8.18" }, { version: "0.6.6" }]
  },
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    }
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    // coinmarketcap: COINMARKET_API_KEY,
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    },
    customChains: [],
  },
};

export default config;
