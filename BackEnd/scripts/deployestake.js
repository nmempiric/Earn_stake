const hre = require('hardhat');

async function main() {

    console.log("deploye staking ---------");
    const Staking = await hre.ethers.getContractFactory("Staking")
    const staking = await Staking.deploy();
    console.log("before deploye------------");
    await staking.deployed();
    console.log("before deployeee----");

    console.log("Factory deployed to:", staking.address);
}   

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
  

// Factory deployed to: 0xABe6f958eFF0Bf9B3D711C7154A5F15038A55239