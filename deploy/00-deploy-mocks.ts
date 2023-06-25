import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, DECIMALS, INITIAL_ANSWER } from "../helper-hardhat-config";

const deployMocks: DeployFunction = async function ({ getNamedAccounts, deployments: { deploy, log }, network }: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log("local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER]
    });
    log("Mocks deployed!");
    log("------------------")
  }
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];