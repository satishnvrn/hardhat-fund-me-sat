import { deployments, ethers, getNamedAccounts, network } from 'hardhat';
import { FundMe, MockV3Aggregator } from '../../typechain-types';
import { assert, expect } from 'chai';
import { developmentChains } from '../../helper-hardhat-config';

describe('FundMe', async () => {
  let fundMe: FundMe;
  let deployer: string;
  let mockV3Aggregator: MockV3Aggregator;
  const sendValue = ethers.parseEther('0.03');
  beforeEach(async () => {
    if (!developmentChains.includes(network.name)) {
      throw 'You need to be on a development chain to run tests';
    }
    deployer = (await getNamedAccounts()).deployer;

    console.log('deploying all contracts');
    const deploymentResults = await deployments.fixture(['all']);

    const fundMeAddress: string = deploymentResults['FundMe']?.address;
    fundMe = (await ethers.getContractAt(
      'FundMe',
      fundMeAddress
    )) as unknown as FundMe;
    const mockV3AggregatorAddress: string =
      deploymentResults['MockV3Aggregator']?.address;
    mockV3Aggregator = (await ethers.getContractAt(
      'MockV3Aggregator',
      mockV3AggregatorAddress
    )) as unknown as MockV3Aggregator;
  });

  describe('Constructor', async () => {
    it('sets the aggregator addresses correctly', async () => {
      const response: string = await fundMe.getPriceFeed();
      const mockV3AggregatorAddress: string =
        await mockV3Aggregator.getAddress();
      assert.equal(response, mockV3AggregatorAddress);
    });
  });

  describe('fund', async () => {
    it("Fails if you don't send enough ETH", async () => {
      await expect(fundMe.fund()).to.be.revertedWith("Didn't send enough ETH");
    });

    it('fund the contract and check funders and addressToAmountFunded map', async () => {
      await fundMe.fund({ value: sendValue });
      const latestFunder = await fundMe.getFunders(0);
      assert.equal(latestFunder, deployer);

      const fundByDeployer = await fundMe.getAddressToAmountFunded(deployer);
      assert.equal(fundByDeployer.toString(), sendValue.toString());
    });
  });

  describe('withdraw', async () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });

    it('withdraw by deployer', async () => {
      const fundMeAddress = await fundMe.getAddress();
      const provider = fundMe.runner?.provider;

      const startingFundMeBalance =
        (await provider?.getBalance(fundMeAddress)) || BigInt(0);
      const startingDeployerBalance =
        (await provider?.getBalance(deployer)) || BigInt(0);

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = (await transactionResponse.wait()) || {
        gasUsed: BigInt(0),
        gasPrice: BigInt(0),
      };
      const { gasUsed, gasPrice } = transactionReceipt;
      const gasCost = gasUsed * gasPrice;

      const endingFundMeBalance =
        (await provider?.getBalance(fundMeAddress)) || BigInt(0);
      const endingDeployerBalance =
        (await provider?.getBalance(deployer)) || BigInt(0);
      assert.equal(endingFundMeBalance, BigInt(0));
      assert.equal(
        (startingFundMeBalance + startingDeployerBalance).toString(),
        (endingDeployerBalance + gasCost).toString()
      );
    });
  });
});
