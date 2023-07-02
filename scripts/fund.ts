import { deployments, ethers } from 'hardhat';

async function main() {
  const fundMeDeployment = await deployments.get('FundMe');
  const fundMe = await ethers.getContractAt(
    'FundMe',
    fundMeDeployment?.address || ''
  );

  const transactionResponse = await fundMe.fund({
    value: ethers.parseEther('0.03'),
  });
  await transactionResponse.wait();
  console.log('Funded!');
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.log(error);
    process.exit(1);
  });
