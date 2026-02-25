const { ethers } = require('hardhat');

async function main() {
  console.log('Starting contract deployment to localhost...');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  // Deploy IssuerVault
  const IssuerVault = await ethers.getContractFactory('IssuerVault');
  const minStakeWei = ethers.parseEther('1');
  const vault = await IssuerVault.deploy(minStakeWei, deployer.address);
  await vault.waitForDeployment();
  console.log('IssuerVault deployed to:', await vault.getAddress());

  // Deploy IssuerRegistry
  const IssuerRegistry = await ethers.getContractFactory('IssuerRegistry');
  const registry = await IssuerRegistry.deploy(await vault.getAddress(), deployer.address);
  await registry.waitForDeployment();
  console.log('IssuerRegistry deployed to:', await registry.getAddress());

  // Deploy CredentialAnchor
  const CredentialAnchor = await ethers.getContractFactory('CredentialAnchor');
  const anchor = await CredentialAnchor.deploy(await registry.getAddress());
  await anchor.waitForDeployment();
  console.log('CredentialAnchor deployed to:', await anchor.getAddress());

  // Deploy RequirementCommit
  const RequirementCommit = await ethers.getContractFactory('RequirementCommit');
  const req = await RequirementCommit.deploy();
  await req.waitForDeployment();
  console.log('RequirementCommit deployed to:', await req.getAddress());

  // Deploy VerifiedEligibilitySBT
  const VerifiedEligibilitySBT = await ethers.getContractFactory('VerifiedEligibilitySBT');
  const sbt = await VerifiedEligibilitySBT.deploy(deployer.address);
  await sbt.waitForDeployment();
  console.log('VerifiedEligibilitySBT deployed to:', await sbt.getAddress());

  // Deploy MockGroth16Verifier
  const MockGroth16Verifier = await ethers.getContractFactory('MockGroth16Verifier');
  const mockVerifier = await MockGroth16Verifier.deploy();
  await mockVerifier.waitForDeployment();
  console.log('MockGroth16Verifier deployed to:', await mockVerifier.getAddress());

  // Deploy NexusVerifier
  const NexusVerifier = await ethers.getContractFactory('NexusVerifier');
  const nexusVerifier = await NexusVerifier.deploy(
    await anchor.getAddress(),
    await req.getAddress(),
    await sbt.getAddress(),
    await mockVerifier.getAddress(),
  );
  await nexusVerifier.waitForDeployment();
  console.log('NexusVerifier deployed to:', await nexusVerifier.getAddress());

  // Grant MINTER_ROLE to NexusVerifier
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes('MINTER_ROLE'));
  await (await sbt.grantRole(MINTER_ROLE, await nexusVerifier.getAddress())).wait();
  console.log('Granted MINTER_ROLE to NexusVerifier');

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

  console.log('\n🚀 All contracts deployed successfully!');
  console.log(JSON.stringify(addresses, null, 2));
}

main().catch((err) => {
  console.error('❌ Deployment failed:', err);
  process.exitCode = 1;
});
