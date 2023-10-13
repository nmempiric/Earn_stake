import React, { useEffect, useState } from "react";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
// import { ethers } from "ethers";
import CustomModal from "./StakeModel";
import { toast } from "react-toastify";
import "./Stake.css";
import { useNavigate } from "react-router-dom";

const Stake = () => {
  const navigate = useNavigate();

  const [aprPercentage, setAprPercentage] = useState(null);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedDurationDays, setSelectedDurationDays] = useState(0);
  const [isLoadingStake, setIsLoadingStake] = useState(false);
  const [isLoadingUnStake, setIsLoadingUnStake] = useState(false);

  // open Stake Modal
  const handleOpenStakeModal = () => {
    setIsStakeModalOpen(true);
  };

  // close Stake Modal
  const handleCloseStakeModal = () => {
    setIsStakeModalOpen(false);
    setStakeAmount("");
    setSelectedDurationDays(0);
  };

  // change stake amount
  const handleStakeAmountChange = (event) => {
    setStakeAmount(event.target.value);
  };

  // stake amount
  const handleStake = async () => {
    setIsStakeModalOpen(false);
    setIsLoadingStake(true);
    if (!stakeAmount || isNaN(stakeAmount)) {
      toast.error("Please enter a valid Stake amount.");
      return;
    }

    if (selectedDurationDays === 0) {
      toast.error("Please select a lock period.");
      return;
    }

    console.log("stake amount----", stakeAmount);
    console.log("lock period time------", selectedDurationDays);

    if (stakeAmount > 0) {
      const apiUrlstake = "http://localhost:3000/stake";
      const data = {
        amount: stakeAmount,
        day: selectedDurationDays,
      };

      axios
        .post(apiUrlstake, data)
        .then((response) => {
          toast.success("Stake Amount Sucessfully");
          setStakeAmount("");
          setSelectedDurationDays(0);
        //   setIsStakeModalOpen(false);
        })
        .catch((error) => {
          console.error("Error fetching data from the API:", error);
          toast.error("Error staking funds");
        })
        .finally(() => {
          setIsLoadingStake(false);
        });
    } else {
      toast.error("Please enter a valid stake amount.");
    }
  };

  // unstake Amount
  const handleUnstake = async () => {
    setIsLoadingUnStake(true);
    const apiUrlunstake = "http://localhost:3000/unstake";
    axios
        .post(apiUrlunstake)
        .then((response) => {
          toast.success("UnStaking Sucessfully");
        })
        .catch((error) => {
          console.error("Transaction failed:", error);
          toast.error("Unstaking failed. Please check the transaction on Etherscan",error);
        })
        .finally(() => {
            setIsLoadingUnStake(false);
          });
  };

  // View History
  const handleViewHistoryClick = () => {
    navigate("/stakehistory");
  };

  // for get the annual Reward Rate
  useEffect(() => {
    const apiUrlReward = "http://localhost:3000/getRewardRate";
    axios
      .get(apiUrlReward)
      .then((response) => {
        setAprPercentage(response.data.RewardRate);
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
      });
  });

  return (
    <>
      <div className="App">
        <h1>Stacking</h1>
        <TableContainer
          component={Paper}
          className="tablecontainer"
          sx={{ width: "1000px" }}
        >
          <Table>
            <TableHead
              className="tablehead"
              sx={{ backgroundColor: "#fef6d8" }}
            >
              <TableRow
                className="tablerow-header"
                sx={{ color: "black", fontStyle: "oblique" }}
              >
                <TableCell sx={{ fontSize: "15px" }}>Coin</TableCell>
                <TableCell sx={{ fontSize: "15px" }}>Est.APR</TableCell>
                <TableCell sx={{ fontSize: "15px" }}>Duration</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* First Row (Etherum) */}
              <TableRow sx={{ textAlign: "center" }}>
                <TableCell sx={{ fontSize: "20px" }}>
                  {" "}
                  <FontAwesomeIcon icon={faEthereum} size="1.5x" /> ETH
                </TableCell>
                {aprPercentage !== null ? (
                  <TableCell sx={{ color: "#0ba66d", fontSize: "20px" }}>
                    {" "}
                    {aprPercentage}%
                  </TableCell>
                ) : (
                  <TableCell sx={{ color: "#0ba66d" }}>--</TableCell>
                )}
                <TableCell>
                  <Button
                    sx={{
                      backgroundColor: "#fafafa",
                      color: "black",
                      variant: "outlined",
                      border: "1px solid #cbb353",
                      ml: "5px",
                      "&:hover": { border: "2px solid #cbb353" },
                    }}
                    onClick={() => setSelectedDurationDays(1)}
                  >
                    1
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "#fafafa",
                      color: "black",
                      variant: "outlined",
                      border: "1px solid #cbb353",
                      ml: "5px",
                      "&:hover": { border: "2px solid #cbb353" },
                    }}
                    onClick={() => setSelectedDurationDays(15)}
                  >
                    15
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "#fafafa",
                      color: "black",
                      variant: "outlined",
                      border: "1px solid #cbb353",
                      ml: "5px",
                      "&:hover": { border: "2px solid #cbb353" },
                    }}
                    onClick={() => setSelectedDurationDays(30)}
                  >
                    30
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "#fafafa",
                      color: "black",
                      variant: "outlined",
                      border: "1px solid #cbb353",
                      ml: "5px",
                      "&:hover": { border: "2px solid #cbb353" },
                    }}
                    onClick={() => setSelectedDurationDays(60)}
                  >
                    60
                  </Button>
                </TableCell>
                <TableCell>
                  {/* <Button
                    className="subbutton"
                    sx={{
                      backgroundColor: "#fcd535",
                      color: "black",
                      "&:hover": { backgroundColor: "#cbb353" },
                    }}
                    onClick={handleOpenStakeModal}
                  >
                    Stake
                  </Button> */}

                  {isLoadingStake ? (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#fcd535",
                        color: "black",
                        "&:hover": { backgroundColor: "#cbb353" },
                      }}
                    >
                      <CircularProgress />
                    </Button>
                  ) : (
                    <Button
                      className="subbutton"
                      sx={{
                        backgroundColor: "#fcd535",
                        color: "black",
                        "&:hover": { backgroundColor: "#cbb353" },
                      }}
                      onClick={handleOpenStakeModal}
                    >
                      Stake
                    </Button>
                  )}

                  {/* <Button
                    className="withbutton"
                    sx={{
                      backgroundColor: "#fcd535",
                      ml: "10px",
                      color: "black",
                      "&:hover": { backgroundColor: "#cbb353" },
                    }}
                    onClick={handleUnstake}
                  >
                    unStake
                  </Button> */}
                  {isLoadingUnStake ? (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#fcd535",
                        color: "black",
                        ml: "10px",
                        "&:hover": { backgroundColor: "#cbb353" },
                      }}
                    >
                      <CircularProgress />
                    </Button>
                  ) : (
                    <Button
                    className="withbutton"
                    sx={{
                      backgroundColor: "#fcd535",
                      ml: "10px",
                      color: "black",
                      "&:hover": { backgroundColor: "#cbb353" },
                    }}
                    onClick={handleUnstake}
                  >
                    unStake
                  </Button>
                  )}

                  <Button
                    className="historybutton"
                    sx={{
                      backgroundColor: "#fcd535",
                      ml: "10px",
                      color: "black",
                      "&:hover": { backgroundColor: "#cbb353" },
                    }}
                    onClick={handleViewHistoryClick}
                  >
                    View History
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Stake Modal */}
        <CustomModal
          open={isStakeModalOpen}
          handleClose={handleCloseStakeModal}
          handleAction={handleStake}
          actionButtonText="Stake"
          amount={stakeAmount}
          onAmountChange={handleStakeAmountChange}
          title=" Stake ETH"
          duration="Duration (Day)"
          // total="Flexible"
          d="1"
          d1="15"
          d2="30"
          d3="60"
          onLockPeriodChange={(duration) => setSelectedDurationDays(duration)}
        />
      </div>
    </>
  );
};

export default Stake;
