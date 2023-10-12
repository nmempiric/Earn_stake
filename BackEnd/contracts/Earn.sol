// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract SimpleEarn {
    uint256 public constant AnnualIntrestRate = 500;

    struct Deposit {
        uint256 amount; // deposit amount
        uint256 timestamp; // deposit time
    }

    struct Withdrawal {
        uint256 amount; // withdrawal amount
        uint256 timestamp; // withdrawal time
    }

    mapping(address => Deposit[]) public deposits;
    mapping(address => Withdrawal[]) public withdrawals;
    mapping(address => uint256) public userTotalBalance;

function getDepositHistory(address _address) public view returns (Deposit[] memory) {
        return deposits[_address];
}

function getWithdrawalHistory(address _address) public view returns (Withdrawal[] memory) {
        return withdrawals[_address];
}

 // Add a function to calculate the total balance with interest for a user
function getTotalBalanceWithInterest(address user) public view returns (uint256) {
        uint256 totalBalance = 0;

        for (uint256 i = 0; i < deposits[user].length; i++) {
            uint256 depositAmount = deposits[user][i].amount;
            uint256 depositTimestamp = deposits[user][i].timestamp;

            // Calculate interest for the deposit
            uint256 interestEarned = calculateInterest(depositAmount, depositTimestamp);

            // Add the interest to the total balance
            totalBalance += depositAmount + interestEarned;
        }

        return totalBalance;
}

function deposit() external payable {
        require(msg.value > 0, "You must deposit some funds");
        deposits[msg.sender].push(Deposit(msg.value, block.timestamp)); // deposit amount and time
        userTotalBalance[msg.sender] += msg.value;
        // totalDeposits += msg.value;
}

function withdraw(uint256 withdrawalAmount) external payable {
        require(withdrawalAmount > 0, "Withdrawal amount must be greater than 0");
        require(userTotalBalance[msg.sender] >= withdrawalAmount, "Insufficient balance to withdraw");

        uint256 totalAmountWithdrawn = 0;
        Withdrawal[] storage withdrawalHistory = withdrawals[msg.sender];


        // Find deposits that can cover the withdrawal amount including interest
        for (uint256 i = 0; i < deposits[msg.sender].length; i++) {
            uint256 newwithdraw = withdrawalAmount - totalAmountWithdrawn;

            console.log("new withdrawal in for loop:",newwithdraw);

            Deposit storage dep = deposits[msg.sender][i];
            uint256 depositAmount = dep.amount;
            uint256 depositTimestamp = dep.timestamp;

            // Ensure the deposit is matured
            if (block.timestamp >= depositTimestamp) {
                uint256 interestEarned = calculateInterest(depositAmount, depositTimestamp);
                uint256 depositTotalAmount = depositAmount + interestEarned;

                console.log("total deposit amount in 1 if block",depositTotalAmount);

                if (depositTotalAmount >= newwithdraw) {
                    // Update the deposit amount and total balance
                    deposits[msg.sender][i].amount -= newwithdraw;
                    userTotalBalance[msg.sender] -= newwithdraw;

                     console.log("total use balance in 2 if  block:",userTotalBalance[msg.sender]);

                    // Accumulate the withdrawal amount
                    totalAmountWithdrawn += newwithdraw;
                    break; // Exit the loop as the withdrawal is complete
                } else {
                    // This deposit doesn't cover the full withdrawal amount, deduct it and continue
                    totalAmountWithdrawn += depositTotalAmount;
                    console.log("total amount withdrawal amount in else block : ",totalAmountWithdrawn);
                    userTotalBalance[msg.sender] -= depositTotalAmount;
                    console.log("total use balance in else block:",userTotalBalance[msg.sender]);
                    // delete deposits[msg.sender][i];

                    // Shift the remaining deposits to fill the gap
                    for (uint256 j = i; j < deposits[msg.sender].length - 1; j++) {
                        deposits[msg.sender][j] = deposits[msg.sender][j + 1];
                    }
                    
                    // Delete the last element as it's now duplicated
                    delete deposits[msg.sender][deposits[msg.sender].length - 1];
                    
                    // Reduce the length of the array
                    deposits[msg.sender].pop();

                    console.log("array length in else block:",deposits[msg.sender].length);
                }
            }
            
        }

        require(totalAmountWithdrawn > 0, "Withdrawal failed");

        // Add the withdrawal entry after the loop for the totalAmountWithdrawn
        withdrawalHistory.push(Withdrawal(totalAmountWithdrawn, block.timestamp));
        console.log("Final total amount to pay------",totalAmountWithdrawn);

        // Transfer the total withdrawal amount (including interest) to the user
        payable(msg.sender).transfer(totalAmountWithdrawn);
}

function calculateInterest(uint256 amount, uint256 timestamp) internal view returns (uint256) {
        uint256 elapsedTime = block.timestamp - timestamp;
        uint256 dailyInterest = (amount * AnnualIntrestRate * elapsedTime) / (365 days * 100);
        return dailyInterest;
}

    // function getContractBalance() public view returns (uint256) {
    //     return address(this).balance;
    // }

    // Receive Fund
    // function receiveFunds() external payable {}

    // Fallback function to receive funds
    receive() external payable {}
}
