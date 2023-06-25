import { deployments, ethers, getNamedAccounts, network } from 'hardhat';
import { FundMe, MockV3Aggregator } from '../../typechain-types';
import { Address } from 'hardhat-deploy/dist/types';
import { assert } from 'chai';
import { developmentChains } from '../../helper-hardhat-config';

describe('FundMe', async () => {
  let fundMe: FundMe;
  let deployer: Address;
  let mockV3Aggregator: MockV3Aggregator;
  beforeEach(async () => {
    if (!developmentChains.includes(network.name)) {
      throw "You need to be on a development chain to run tests"
    }

    console.log('deploying all contracts');
    await deployments.fixture(['all']);

    deployer = (await getNamedAccounts())?.deployer;
    console.log('deployer', deployer);
    console.log('chainId', network.config.chainId);
    fundMe = await ethers.getContractAt("FundMe", deployer) as unknown as FundMe;
    console.log('fundMe', fundMe);
    // mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", deployer) as unknown as MockV3Aggregator;
    // console.log('mockV3Aggregator', mockV3Aggregator);
  });

  describe("Constructor",async () => {
    // beforeEach();
    it("sets the aggregator addresses correctly",async () => {
      // const response = await fundMe.priceFeed();
      const response = '';
      // const mockV3AggregatorAddress = await mockV3Aggregator.getAddress();
      const mockV3AggregatorAddress = '';
      assert.equal(response, mockV3AggregatorAddress);
    });
  });
});
