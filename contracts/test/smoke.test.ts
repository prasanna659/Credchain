import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Credchain contracts (smoke)', () => {
  it('issuer stakes and registers', async () => {
    const [admin, issuer] = await ethers.getSigners()

    const vault = await (await ethers.getContractFactory('IssuerVault'))
      .connect(admin)
      .deploy(ethers.parseEther('1'), admin.address)
    await vault.waitForDeployment()

    const registry = await (await ethers.getContractFactory('IssuerRegistry'))
      .connect(admin)
      .deploy(await vault.getAddress(), admin.address)
    await registry.waitForDeployment()

    await vault.connect(issuer).stake({ value: ethers.parseEther('1') })

    const didHash = ethers.keccak256(ethers.toUtf8Bytes('did:demo:iit'))
    await registry.connect(issuer).register(didHash)

    const ISSUER_ROLE = await registry.ISSUER_ROLE()
    expect(await registry.hasRole(ISSUER_ROLE, issuer.address)).to.equal(true)
    expect(await registry.issuerDidHash(issuer.address)).to.equal(didHash)
  })
})

