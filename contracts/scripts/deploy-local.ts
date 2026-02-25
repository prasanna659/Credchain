import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()

  const minStakeWei = ethers.parseEther('1')

  const IssuerVault = await ethers.getContractFactory('IssuerVault')
  const vault = await IssuerVault.deploy(minStakeWei, deployer.address)
  await vault.waitForDeployment()

  const IssuerRegistry = await ethers.getContractFactory('IssuerRegistry')
  const registry = await IssuerRegistry.deploy(await vault.getAddress(), deployer.address)
  await registry.waitForDeployment()

  const CredentialAnchor = await ethers.getContractFactory('CredentialAnchor')
  const anchor = await CredentialAnchor.deploy(await registry.getAddress())
  await anchor.waitForDeployment()

  const RequirementCommit = await ethers.getContractFactory('RequirementCommit')
  const req = await RequirementCommit.deploy()
  await req.waitForDeployment()

  const VerifiedEligibilitySBT = await ethers.getContractFactory('VerifiedEligibilitySBT')
  const sbt = await VerifiedEligibilitySBT.deploy(deployer.address)
  await sbt.waitForDeployment()

  const MockGroth16Verifier = await ethers.getContractFactory('MockGroth16Verifier')
  const mockVerifier = await MockGroth16Verifier.deploy()
  await mockVerifier.waitForDeployment()

  const NexusVerifier = await ethers.getContractFactory('NexusVerifier')
  const nexusVerifier = await NexusVerifier.deploy(
    await anchor.getAddress(),
    await req.getAddress(),
    await sbt.getAddress(),
    await mockVerifier.getAddress(),
  )
  await nexusVerifier.waitForDeployment()

  // allow NexusVerifier to mint SBTs
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes('MINTER_ROLE'))
  await (await sbt.grantRole(MINTER_ROLE, await nexusVerifier.getAddress())).wait()

  const addresses = {
    network: 'localhost',
    IssuerVault: await vault.getAddress(),
    IssuerRegistry: await registry.getAddress(),
    CredentialAnchor: await anchor.getAddress(),
    RequirementCommit: await req.getAddress(),
    VerifiedEligibilitySBT: await sbt.getAddress(),
    Groth16Verifier: await mockVerifier.getAddress(),
    NexusVerifier: await nexusVerifier.getAddress(),
  }

  console.log(JSON.stringify(addresses, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

