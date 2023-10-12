const hre = require('hardhat');

async function main() {

    const SimpleEarn = await hre.ethers.getContractFactory("SimpleEarn")
    const simpleEarn = await SimpleEarn.deploy();

    await simpleEarn.deployed();

    console.log("Factory deployed to:", simpleEarn.address);
}   

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
  

// Factory deployed to: 0xBF6B860802Ab29184F43F6678B10a9ce2E76C9FE