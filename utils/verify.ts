import { run } from "hardhat";

export const verify = async function(contractAddress: string, args: any) {
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if(error.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(error);
    }
  }
}