const ethers = require("ethers");
var express = require("express");
var app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();
const stakeABI = require("../BackEnd/ABI/Staking.json");
const earnABI = require("../BackEnd/ABI/SimpleEarn.json");

const {
  API_URL,
  PRIVATE_KEY,
  STAKE_CONTRACT_ADDRESS,
  EARN_CONTRACT_ADDRESS,
  PRIVATE_KEY2,
} = process.env;
console.log("API------", API_URL);
console.log("Private key----", PRIVATE_KEY);
console.log("Stack contract Address------", STAKE_CONTRACT_ADDRESS);
console.log("Earn contract Address-----", EARN_CONTRACT_ADDRESS);

// All Detail for STAKING

const stakecontractABI = stakeABI.abi;
// console.log("ABI========",stakecontractABI);
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const contract = new ethers.Contract(
  STAKE_CONTRACT_ADDRESS,
  stakecontractABI,
  provider
);
const signer = new ethers.Wallet(PRIVATE_KEY2, provider);
const signcontract = new ethers.Contract(
  STAKE_CONTRACT_ADDRESS,
  stakecontractABI,
  signer
);

// All Detal for Earning

const earncontractABI = earnABI.abi;
// console.log("ABI===========",earncontractABI);

const earncontract = new ethers.Contract(
  EARN_CONTRACT_ADDRESS,
  earncontractABI,
  provider
);
const earnsigner = new ethers.Wallet(PRIVATE_KEY2, provider);
const earnsigncontract = new ethers.Contract(
  EARN_CONTRACT_ADDRESS,
  earncontractABI,
  earnsigner
);

app.get("/hello", function (req, res) {
  res.send("welcome to...");
});

// STAKING API

// get AnuualRewardRate
app.get("/getRewardRate", async function (req, res) {
  try {
    const Rate = await contract.AnnualRewardRate();
    const percentage = new ethers.BigNumber.from(Rate).div(100).toNumber();
    res.status(200).json({ RewardRate: percentage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesasage: error });
  }
});

// stake
app.post("/stake", async function (req, res) {
  try {
    const { amount, day } = req.body;
    const tx = await signcontract.stake(day, {
      value: ethers.utils.parseEther(amount),
    });
    await tx.wait();
    res
      .status(200)
      .json({ message: "Stake Amount successfully", transactionHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesasage: error });
  }
});

// get stake detail
app.post("/stakeDetail", async function (req, res) {
  try {
    const { Address } = req.body;
    const stakeData = await contract.getStakeDetail(Address);

    // Format the stake data
    const formattedStakeData = stakeData.map((entry) => ({
      amount: ethers.utils.formatEther(entry[0]),
      timestamp: new Date(entry[1] * 1000).toLocaleString(),
      lockPeriodInDay: parseInt(parseInt(entry[2]) / 86400),
    }));

    console.log("stake data-----", formattedStakeData);
    res.status(200).json({ Data: formattedStakeData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// unstake amount
app.post("/unstake", async function (req, res) {
  try {
    const unstakeData = await signcontract.unstake();
    console.log("unstaking-------------", unstakeData);
    await unstakeData.wait();
    res.status(200).json({
      message: "UnStake Amount successfully",
      transactionHash: unstakeData.hash,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// get unstake detail
app.post("/unstakeDetail", async function (req, res) {
  try {
    const { Address } = req.body;
    const unstakeData = await contract.getUnStakeDetail(Address);

    // Format the unstake data
    const formattedUnStakeData = unstakeData.map((entry) => ({
      amount: ethers.utils.formatEther(entry[0]),
      timestamp: new Date(entry[1] * 1000).toLocaleString(),
      lockPeriodInDay: parseInt(parseInt(entry[2]) / 86400),
      rewardAmount: ethers.utils.formatEther(entry[3]),
    }));

    console.log("unstake data-----", formattedUnStakeData);
    res.status(200).json({ Data: formattedUnStakeData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

//  Earning API

// get Annual Intrest Rate
app.get("/getIntrestRate", async function (req, res) {
  try {
    const Rate = await earncontract.AnnualIntrestRate();
    const percentage = new ethers.BigNumber.from(Rate).div(100).toNumber();
    res.status(200).json({ IntrestRate: percentage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// Deposit
app.post("/deposit", async function (req, res) {
  try {
    const { amount } = req.body;
    const depositAmount = await earnsigncontract.deposit({
      value: ethers.utils.parseEther(amount),
    });
    await depositAmount.wait();
    res.status(200).json({
      mesasage: "subscribe successfully",
      transactionHash: depositAmount.hash,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// get User Total Balance
app.post("/getuserBalance", async function (req, res) {
  try {
    const { Address } = req.body;
    const totalBalance = await earncontract.getTotalBalanceWithInterest(Address);
    const balanceInEth = totalBalance.toString();
    // console.log("Total User Balance:", ethers.utils.formatEther(balanceInEth));
    res.status(200).json({ Balance: ethers.utils.formatEther(balanceInEth) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// deposit history
app.post("/depositHistory",async function (req,res){
  try{
    const {Address} = req.body;
    const DepositData = await earncontract.getDepositHistory(Address);

     // Format the deposit data
     const formattedDepositData = DepositData.map((entry) => ({
      amount: ethers.utils.formatEther(entry[0]),
      timestamp: new Date(entry[1] * 1000).toLocaleString(),
    }));

    console.log("Deposit data-----", formattedDepositData);
    res.status(200).json({Data:formattedDepositData})

  }catch(error){
    console.error(error);
    res.status(500).json({mesasage:error});
  }

});

// withdraw Amount
app.post("/withdraw", async function(req,res){
try{
  const {amount} = req.body;
  const withdrawamount = await earnsigncontract.withdraw(amount);
  await withdrawamount.wait();
  res.status(200).json({message : "withdraw amount successfully",transactionHash : withdrawamount.hash});

}catch(error){
  console.error(error);
  res.status(500).json({message : error});
}
});

// withdraw history
app.post("/withdrawHistory",async function (req,res){
  try{
    const {Address} = req.body;
    const WithdrawData = await earncontract.getWithdrawalHistory(Address);

     // Format the deposit data
     const formattedWithdrawData = WithdrawData.map((entry) => ({
      amount: ethers.utils.formatEther(entry[0]),
      timestamp: new Date(entry[1] * 1000).toLocaleString(),
    }));

    console.log("Deposit data-----", formattedWithdrawData);
    res.status(200).json({Data:formattedWithdrawData})

  }catch(error){
    console.error(error);
    res.status(500).json({mesasage:error});
  }

});

app.listen(3000);
