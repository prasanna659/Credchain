const hre = require('hardhat');

async function main() {
  console.log('🚀 Starting contract deployment to localhost...');

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log('👤 Deploying contracts with account:', deployer.address);
  console.log('💰 Account balance:', hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), 'ETH');

  try {
    // Deploy IssuerVault
    console.log('📦 Deploying IssuerVault...');
    const IssuerVault = await hre.ethers.getContractFactory('IssuerVault');
    const minStakeWei = hre.ethers.parseEther('1');
    const vault = await IssuerVault.deploy(minStakeWei, deployer.address);
    await vault.waitForDeployment();
    console.log('✅ IssuerVault deployed to:', await vault.getAddress());

    // Deploy IssuerRegistry
    console.log('📦 Deploying IssuerRegistry...');
    const IssuerRegistry = await hre.ethers.getContractFactory('IssuerRegistry');
    const registry = await IssuerRegistry.deploy(await vault.getAddress(), deployer.address);
    await registry.waitForDeployment();
    console.log('✅ IssuerRegistry deployed to:', await registry.getAddress());

    // Deploy CredentialAnchor
    console.log('📦 Deploying CredentialAnchor...');
    const CredentialAnchor = await hre.ethers.getContractFactory('CredentialAnchor');
    const anchor = await CredentialAnchor.deploy(await registry.getAddress());
    await anchor.waitForDeployment();
    console.log('✅ CredentialAnchor deployed to:', await anchor.getAddress());

    // Deploy RequirementCommit
    console.log('📦 Deploying RequirementCommit...');
    const RequirementCommit = await hre.ethers.getContractFactory('RequirementCommit');
    const req = await RequirementCommit.deploy();
    await req.waitForDeployment();
    console.log('✅ RequirementCommit deployed to:', await req.getAddress());

    // Deploy VerifiedEligibilitySBT
    console.log('📦 Deploying VerifiedEligibilitySBT...');
    const VerifiedEligibilitySBT = await hre.ethers.getContractFactory('VerifiedEligibilitySBT');
    const sbt = await VerifiedEligibilitySBT.deploy(deployer.address);
    await sbt.waitForDeployment();
    console.log('✅ VerifiedEligibilitySBT deployed to:', await sbt.getAddress());

    // Deploy MockGroth16Verifier
    console.log('📦 Deploying MockGroth16Verifier...');
    const MockGroth16Verifier = await hre.ethers.getContractFactory('MockGroth16Verifier');
    const mockVerifier = await MockGroth16Verifier.deploy();
    await mockVerifier.waitForDeployment();
    console.log('✅ MockGroth16Verifier deployed to:', await mockVerifier.getAddress());

    // Deploy NexusVerifier
    console.log('📦 Deploying NexusVerifier...');
    const NexusVerifier = await hre.ethers.getContractFactory('NexusVerifier');
    const nexusVerifier = await NexusVerifier.deploy(
      await anchor.getAddress(),
      await req.getAddress(),
      await sbt.getAddress(),
      await mockVerifier.getAddress(),
    );
    await nexusVerifier.waitForDeployment();
    console.log('✅ NexusVerifier deployed to:', await nexusVerifier.getAddress());

    // Grant MINTER_ROLE to NexusVerifier
    console.log('🔐 Granting MINTER_ROLE to NexusVerifier...');
    const MINTER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes('MINTER_ROLE'));
    await (await sbt.grantRole(MINTER_ROLE, await nexusVerifier.getAddress())).wait();
    console.log('✅ MINTER_ROLE granted successfully');

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

    console.log('\n🎉 All contracts deployed successfully!');
    console.log('📍 Contract Addresses:');
    console.log(JSON.stringify(addresses, null, 2));

    // Save addresses to file for easy access
    const fs = require('fs');
    fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
    console.log('📄 Addresses saved to deployed-addresses.json');

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exitCode = 1;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
