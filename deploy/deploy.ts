import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedWorkspace = await deploy("CompanyWorkspace", {
    from: deployer,
    log: true,
  });

  console.log(`CompanyWorkspace contract: ${deployedWorkspace.address}`);
};

export default func;
func.id = "deploy_companyWorkspace"; // id required to prevent reexecution
func.tags = ["CompanyWorkspace"];
