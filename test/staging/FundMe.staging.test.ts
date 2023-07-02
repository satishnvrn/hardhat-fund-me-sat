import { deployments, ethers, getNamedAccounts, network } from 'hardhat';
import { developmentChains } from '../../helper-hardhat-config';
import { FundMe } from '../../typechain-types';
import { assert } from 'chai';

developmentChains.includes(network.name)
  ? describe.skip
  : describe('FundMe', async () => {
      let fundMe: FundMe;
      let deployer: string;
      const sendValue = ethers.parseEther('0.03');

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        const fundMeDeployment = await deployments.get('FundMe');

        fundMe = (await ethers.getContractAt(
          'FundMe',
          fundMeDeployment?.address || ''
        ));
      });

      it("allows people to fund and withdraw", async () => {
        const provider = fundMe.runner?.provider;
        const fundMeAddress = await fundMe.getAddress();

        const fundTransactionResponse = await fundMe.fund({ value: sendValue });
        await fundTransactionResponse.wait(1);

        const withdrawTransactionResponse = await fundMe.withdraw();
        await withdrawTransactionResponse.wait(1);

        const endingFundMeBalance = (await provider?.getBalance(fundMeAddress)) || BigInt(0);
        assert.equal(endingFundMeBalance.toString(), '0');
      });
    });
