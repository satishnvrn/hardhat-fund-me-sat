import { DeployFunction } from 'hardhat-deploy/dist/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { developmentChains, networkConfig } from '../helper-hardhat-config';
import { verify } from '../utils/verify';

const deployFundMe: DeployFunction = async function ({
  getNamedAccounts,
  deployments: { deploy, log, get: getAggregator },
  network,
}: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId || 0;

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await getAggregator('MockV3Aggregator');
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed'];
  }

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy('FundMe', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
  });
  log(`FundMe deployed at ${fundMe.address}`);

  if (!developmentChains.includes(network.name)) {
    log('verifying the contract!');
    await verify(fundMe.address, args);
  }
};

export default deployFundMe;
deployFundMe.tags = ['all', 'fundMe'];
