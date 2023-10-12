// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Staking{
    uint256 public constant AnnualRewardRate = 500; 
   
    struct Stake {
        uint256 amount;  //stake amount
        uint256 timestamp;  //stake time
        uint256 lockPeriodInDay; //lock period in Day
    }

    struct Unstake {
        uint256 amount; // unstaked amount
        uint256 timestamp; // unstake time
        uint256 lockPeriodInDay; //lock period in Day
        uint256 rewardAmount;  // reward amount

    }

    mapping(address => Stake[]) public stakes;
    mapping(address => Unstake[]) public unstakes;
    mapping(address => uint256) public userTotalBalance;

    event LogMessage(string message);

function getStakeDetail(address _address) public view returns (Stake[] memory){

        return stakes[_address];
}

function getUnStakeDetail(address _address) public view returns (Unstake[] memory){

        return unstakes[_address];
}

function stake(uint256 _lockperiodInDay) external payable {
        require(msg.value > 0, "You must Stake some funds");
        require(_lockperiodInDay > 0 , "Lock Period must be greater then 0");

        // convert lock period in second
         uint256 lockPeriodInSeconds = _lockperiodInDay * 1 days;
         console.log("Lock period time in second:::::::::" , lockPeriodInSeconds);

        stakes[msg.sender].push(Stake(msg.value,1694751030,lockPeriodInSeconds)); //Stake amount,time & lock period
        userTotalBalance[msg.sender] += msg.value;

}

function unstake() external payable {
    require(userTotalBalance[msg.sender] > 0, "No Funds to withdraw");

    uint256 i = 0;
    while (i < stakes[msg.sender].length) {
        Stake storage st = stakes[msg.sender][i];
        console.log("usertotal balance in for====", userTotalBalance[msg.sender]);

        uint256 stakeamount = st.amount;
        uint256 staketimestamp = st.timestamp;
        uint256 stakelockPeriodInDay = st.lockPeriodInDay;

        console.log("stakeamount=======", stakeamount);
        console.log("staketimestamp======", staketimestamp);
        console.log("stakelockPeriodInDay=========", stakelockPeriodInDay);

        // check if Stake has matured
        if (block.timestamp >= staketimestamp + stakelockPeriodInDay) {
            // calculate Reward
            uint256 Reward = calculateRewardAmount(stakeamount, staketimestamp, stakelockPeriodInDay);
            console.log("Reward Amount====", Reward);

            emit LogMessage("before totalStakeAmount");

            uint256 totalStakeAmount = stakeamount + Reward;

            emit LogMessage("after  totalStakeAmount");

            console.log("Total Stake Amount======", totalStakeAmount);

            // Add the unstaked amount to the unstakes array
            emit LogMessage("before unstake");
            unstakes[msg.sender].push(Unstake(stakeamount, block.timestamp, stakelockPeriodInDay, Reward));
            emit LogMessage("after unstake");

            // Move the last element in the array to the position of the element to be deleted
            stakes[msg.sender][i] = stakes[msg.sender][stakes[msg.sender].length - 1];
            // Reduce the length of the array to delete the last element
            stakes[msg.sender].pop();

            // transfer total amount including Reward to user
            payable(msg.sender).transfer(totalStakeAmount);

            emit LogMessage("after payable");

            // update balance and totalstake
            userTotalBalance[msg.sender] -= totalStakeAmount;

        } else {
            console.log("Stake not matured yet for this index:::::::::::::", i);
            i++; // Increment `i` only when the stake is not matured
        }

        console.log("usertotal balance after if====", userTotalBalance[msg.sender]);
    }
}


function claimRewardOnly() external {
    require(userTotalBalance[msg.sender] > 0, "No Funds to claim");
    for (uint256 i = 0; i < stakes[msg.sender].length; i++) {
        Stake storage st = stakes[msg.sender][i];

        uint256 stakeamount = st.amount;
        uint256 staketimestamp = st.timestamp;
        uint256 stakelockPeriodInDay = st.lockPeriodInDay;

        // check if Stake has matured
        if (block.timestamp >= staketimestamp + stakelockPeriodInDay) {
            // calculate Reward
            uint256 Reward = calculateRewardAmount(stakeamount, staketimestamp, stakelockPeriodInDay);

            console.log("Caculated reward for ",i,"is -----------",Reward);

            // transfer the reward to the user
            payable(msg.sender).transfer(Reward);

            // update user's total balance and totalRewardClaimed
            userTotalBalance[msg.sender] += Reward;

            // Update the Stake amount and current timestemp
                st.amount = stakeamount;
                st.timestamp = block.timestamp;
        }
    }

    
}

function unstakeAmountBeforeLockPeriod() external {
    require(userTotalBalance[msg.sender] > 0, "No Funds to withdraw");

    uint256 i = 0;
    while (i < stakes[msg.sender].length) {
        Stake storage st = stakes[msg.sender][i];
        console.log("usertotal balance in for====", userTotalBalance[msg.sender]);

        uint256 stakeamount = st.amount;
        uint256 staketimestamp = st.timestamp;
        uint256 stakelockPeriodInDay = st.lockPeriodInDay;

        // unStake amount before matured
        if (block.timestamp < staketimestamp + stakelockPeriodInDay) {
            uint256 Reward = 0;
            // Add the unstaked amount to the unstakes array
            unstakes[msg.sender].push(Unstake(stakeamount, block.timestamp, stakelockPeriodInDay, Reward));

            // transfer total amount without Reward to user
            payable(msg.sender).transfer(stakeamount);

            // update balance and totalstake
            userTotalBalance[msg.sender] -= stakeamount;

            // Remove the stake from the array
            stakes[msg.sender][i] = stakes[msg.sender][stakes[msg.sender].length - 1];
            stakes[msg.sender].pop();
        } else {
            console.log("Stake has not matured yet for this index:", i);
            i++; // Increment `i` only when the stake has not matured
        }

        console.log("usertotal balance after if====", userTotalBalance[msg.sender]);
    }
}


function calculateRewardAmount(uint256 stakedAmount, uint256 timestamp, uint256 lockDurationDays) internal  view returns (uint256) {

        uint256 elapsedTime = block.timestamp - timestamp;
        
        if(elapsedTime < lockDurationDays)
        {
            return 0;  // No reward intill the lock period time over
        }
        
        // calculate the Reward Amount
       uint256 rewardAmount = (stakedAmount * AnnualRewardRate * lockDurationDays) / (365 days * 100);
        return rewardAmount;
}

// // Receive Fund
// function receiveFunds() external payable {
// }

// function getContractBalance() public view returns (uint256) {
//     return address(this).balance;
// }

// Fallback function to receive funds
receive() external payable {}

}
