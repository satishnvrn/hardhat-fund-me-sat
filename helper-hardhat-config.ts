export interface networkConfigItem {
  name?: string;
  ethUsdPriceFeed?: string;
  blockConfirmations?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    blockConfirmations: 6
  },
  31337: {}
};

export const developmentChains: string[] = ["hardhat", "localhost"];
export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000;