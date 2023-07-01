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
    const deploymentResults = await deployments.fixture(['all']);

    const fundMeAddress: string = deploymentResults["FundMe"]?.address;
    fundMe = await ethers.getContractAt("FundMe", fundMeAddress) as unknown as FundMe;
    const mockV3AggregatorAddress: string = deploymentResults["MockV3Aggregator"]?.address;
    mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", mockV3AggregatorAddress) as unknown as MockV3Aggregator;
  });

  describe("Constructor",async () => {
    it("sets the aggregator addresses correctly",async () => {
      const response: string = await fundMe.getPriceFeed();
      const mockV3AggregatorAddress: string = await mockV3Aggregator.getAddress();
      assert.equal(response, mockV3AggregatorAddress);
    });
  });
});
