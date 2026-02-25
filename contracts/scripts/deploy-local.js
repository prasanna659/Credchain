const { ethers } = require('ethers');

async function main() {
  // Connect to local blockchain
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  const deployer = new ethers.Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e', provider);

  const minStakeWei = ethers.parseEther('1');

  // Contract ABIs (simplified for deployment)
  const contractFactories = {
    IssuerVault: await ethers.getContractFactory('IssuerVault'),
    IssuerRegistry: await ethers.getContractFactory('IssuerRegistry'),
    CredentialAnchor: await ethers.getContractFactory('CredentialAnchor'),
    RequirementCommit: await ethers.getContractFactory('RequirementCommit'),
    VerifiedEligibilitySBT: await ethers.getContractFactory('VerifiedEligibilitySBT'),
    MockGroth16Verifier: await ethers.getContractFactory('MockGroth16Verifier'),
    NexusVerifier: await ethers.getContractFactory('NexusVerifier'),
  };

  const IssuerVault = contractFactories.IssuerVault;
  const vault = await IssuerVault.connect(deployer).deploy(minStakeWei, deployer.address);
  await vault.waitForDeployment();

  const IssuerRegistry = contractFactories.IssuerRegistry;
  const registry = await IssuerRegistry.connect(deployer).deploy(await vault.getAddress(), deployer.address);
  await registry.waitForDeployment();

  const CredentialAnchor = contractFactories.CredentialAnchor;
  const anchor = await CredentialAnchor.connect(deployer).deploy(await registry.getAddress());
  await anchor.waitForDeployment();

  const RequirementCommit = contractFactories.RequirementCommit;
  const req = await RequirementCommit.connect(deployer).deploy();
  await req.waitForDeployment();

  const VerifiedEligibilitySBT = contractFactories.VerifiedEligibilitySBT;
  const sbt = await VerifiedEligibilitySBT.connect(deployer).deploy(deployer.address);
  await sbt.waitForDeployment();

  const MockGroth16Verifier = contractFactories.MockGroth16Verifier;
  const mockVerifier = await MockGroth16Verifier.connect(deployer).deploy();
  await mockVerifier.waitForDeployment();

  const NexusVerifier = contractFactories.NexusVerifier;
  const nexusVerifier = await NexusVerifier.connect(deployer).deploy(
    await anchor.getAddress(),
    await req.getAddress(),
    await sbt.getAddress(),
    await mockVerifier.getAddress(),
  );
  await nexusVerifier.waitForDeployment();

  // allow NexusVerifier to mint SBTs
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes('MINTER_ROLE'));
  await (await sbt.connect(deployer).grantRole(MINTER_ROLE, await nexusVerifier.getAddress())).wait();

  const addresses = {
    network: 'localhost',
    IssuerVault: await vault.getAddress(),
    IssuerRegistry: await registry.getAddress(),
    CredentialAnchor: await anchor.getAddress(),
    RequirementCommit: await req.getAddress(),
    VerifiedEligibilitySBT: await sbt.getAddress(),
    Groth16Verifier: await mockVerifier.getAddress(),
    NexusVerifier: await nexusVerifier.getAddress(),
  };

  console.log(JSON.stringify(addresses, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
