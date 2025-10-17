import { task } from "hardhat/config";

task("workspace:address", "Prints the CompanyWorkspace address")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments, hre) {
    const { deployments } = hre;

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("CompanyWorkspace");

    console.log(`CompanyWorkspace address: ${deployment.address}`);
  });

task("workspace:create", "Creates a new company")
  .addParam("name", "Company name")
  .addParam("password", "Company password as an EVM address")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("CompanyWorkspace");

    await fhevm.initializeCLIApi();

    const [signer] = await ethers.getSigners();
    const encryptedPassword = await fhevm
      .createEncryptedInput(deployment.address, signer.address)
      .addAddress(taskArguments.password)
      .encrypt();

    const contract = await ethers.getContractAt("CompanyWorkspace", deployment.address);
    const tx = await contract
      .connect(signer)
      .createCompany(taskArguments.name, encryptedPassword.handles[0], encryptedPassword.inputProof);

    console.log(`Submitted tx: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Tx status: ${receipt?.status}`);

    const companyCount = await contract.getCompanyCount();
    console.log(`Latest company id: ${companyCount}`);
  });

task("workspace:join", "Joins an existing company")
  .addParam("id", "Company identifier")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments, hre) {
    const { ethers, deployments } = hre;

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("CompanyWorkspace");

    const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt("CompanyWorkspace", deployment.address);
    const tx = await contract.connect(signer).joinCompany(taskArguments.id);
    console.log(`Submitted tx: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Tx status: ${receipt?.status}`);
  });

task("workspace:company", "Reads company information")
  .addParam("id", "Company identifier")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments, hre) {
    const { ethers, deployments } = hre;

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("CompanyWorkspace");

    const contract = await ethers.getContractAt("CompanyWorkspace", deployment.address);
    const info = await contract.getCompany(taskArguments.id);

    console.log("Name           :", info[0]);
    console.log("Owner          :", info[1]);
    console.log("Password cipher:", info[2]);
    console.log("Created at     :", info[3]);
    console.log("Members        :", info[4]);
    console.log("Documents      :", info[5]);
  });

task("workspace:password", "Decrypts the company password if the signer is allowed")
  .addParam("id", "Company identifier")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("CompanyWorkspace");

    await fhevm.initializeCLIApi();

    const contract = await ethers.getContractAt("CompanyWorkspace", deployment.address);
    const cipher = await contract.getCompanyPasswordCipher(taskArguments.id);

    const [signer] = await ethers.getSigners();
    try {
      const password = await fhevm.userDecryptEaddress(cipher, deployment.address, signer);
      console.log(`Decrypted password address: ${password}`);
    } catch (error) {
      console.error("Failed to decrypt password:", error);
    }
  });

task("workspace:documents", "Lists encrypted documents for a company")
  .addParam("id", "Company identifier")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments, hre) {
    const { ethers, deployments } = hre;

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("CompanyWorkspace");

    const contract = await ethers.getContractAt("CompanyWorkspace", deployment.address);
    const docs = await contract.getDocuments(taskArguments.id);

    console.log(`Found ${docs.length} documents`);
    docs.forEach((doc, index) => {
      console.log(`Document ${index}`);
      console.log(`  encryptedTitle : ${doc.encryptedTitle}`);
      console.log(`  encryptedBody  : ${doc.encryptedBody}`);
      console.log(`  author         : ${doc.author}`);
      console.log(`  createdAt      : ${doc.createdAt}`);
    });
  });
