import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { CompanyWorkspace, CompanyWorkspace__factory } from "../types";

type SignerSet = {
  owner: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployWorkspace() {
  const factory = (await ethers.getContractFactory("CompanyWorkspace")) as CompanyWorkspace__factory;
  const contract = (await factory.deploy()) as CompanyWorkspace;
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  return { contract, address };
}

describe("CompanyWorkspace", function () {
  let signers: SignerSet;
  let contract: CompanyWorkspace;
  let contractAddress: string;

  before(async function () {
    const allSigners = (await ethers.getSigners()) as HardhatEthersSigner[];
    signers = {
      owner: allSigners[0],
      alice: allSigners[1],
      bob: allSigners[2],
    };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      this.skip();
    }

    ({ contract, address: contractAddress } = await deployWorkspace());
  });

  it("stores company metadata and encrypted password", async function () {
    const passwordAddress = signers.owner.address;
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.owner.address)
      .addAddress(passwordAddress)
      .encrypt();

    const tx = await contract
      .connect(signers.owner)
      .createCompany("Acme Corp", encryptedInput.handles[0], encryptedInput.inputProof);
    await tx.wait();

    const info = await contract.getCompany(1);
    expect(info[0]).to.equal("Acme Corp");
    expect(info[1]).to.equal(signers.owner.address);
    expect(info[4]).to.equal(1n);
    expect(info[5]).to.equal(0n);

    const decrypted = await fhevm.userDecryptEaddress(info[2], contractAddress, signers.owner);
    expect(decrypted).to.equal(passwordAddress);
  });

  it("allows new members to decrypt password after joining", async function () {
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.owner.address)
      .addAddress(signers.owner.address)
      .encrypt();

    const createTx = await contract
      .connect(signers.owner)
      .createCompany("Shared", encryptedInput.handles[0], encryptedInput.inputProof);
    await createTx.wait();

    const joinTx = await contract.connect(signers.alice).joinCompany(1);
    await joinTx.wait();

    const isMember = await contract.isMember(1, signers.alice.address);
    expect(isMember).to.equal(true);

    const cipher = await contract.getCompanyPasswordCipher(1);
    const decrypted = await fhevm.userDecryptEaddress(cipher, contractAddress, signers.alice);
    expect(decrypted).to.equal(signers.owner.address);
  });

  it("stores encrypted documents created by members", async function () {
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.owner.address)
      .addAddress(signers.owner.address)
      .encrypt();

    const createTx = await contract
      .connect(signers.owner)
      .createCompany("Docs", encryptedInput.handles[0], encryptedInput.inputProof);
    await createTx.wait();

    const title = "cipher-title";
    const body = "cipher-body";

    const postTx = await contract.connect(signers.owner).postDocument(1, title, body);
    await postTx.wait();

    const info = await contract.getCompany(1);
    expect(info[5]).to.equal(1n);

    const document = await contract.getDocument(1, 0);
    expect(document[0]).to.equal(title);
    expect(document[1]).to.equal(body);
    expect(document[2]).to.equal(signers.owner.address);
  });
});
