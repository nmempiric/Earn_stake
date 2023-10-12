import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import "./Earn.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomModal from "./EarnModel";

function Earn({ connectedAccount }) {
  const navigate = useNavigate();
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [aprPercentage, setAprPercentage] = useState(null);
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [totalBalanceWithInterest, setTotalBalanceWithInterest] =
    useState(null);
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);
  const [isLoadingWithdraw, setIsLoadingWithdraw] = useState(false);

  // open Subscribe Modal
  const handleOpenSubscribeModal = () => {
    setIsSubscribeModalOpen(true);
  };

  // close Subscribe Modal
  const handleCloseSubscribeModal = () => {
    setIsSubscribeModalOpen(false);
    setSubscriptionAmount("");
  };

  // open Withdraw Modal
  const handleOpenWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  // close Withdraw Modal
  const handleCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
    setWithdrawAmount("");
  };

  // change subscription amount
  const handleSubscriptionAmountChange = (event) => {
    setSubscriptionAmount(event.target.value);
  };

  // change withdraw amount
  const handleWithdrawAmountChange = (event) => {
    setWithdrawAmount(event.target.value);
  };

  // Deposite amount
  const handleSubscription = async () => {
    setIsSubscribeModalOpen(false);
    setIsLoadingDeposit(true);
    if (!subscriptionAmount || isNaN(subscriptionAmount)) {
      toast.error("Please enter a valid subscription amount.");
      return;
    }
    const amountInEth = parseFloat(subscriptionAmount);
    console.log("Amount in Ether========", amountInEth);

    if (subscriptionAmount > 0) {
      const apiUrldeposit = "http://localhost:3000/deposit";
      const data = {
        amount: subscriptionAmount,
      };

      axios
        .post(apiUrldeposit, data)
        .then((response) => {
          toast.success("Deposit Amount Sucessfully");
          setSubscriptionAmount("");

          //   setIsSubscribeModalOpen(false);
        })
        .catch((error) => {
          console.error("Error fetching data from the API:", error);
          toast.error("Error depoiting funds");
        })
        .finally(() => {
          setIsLoadingDeposit(false);
        });
    } else {
      toast.error("Please enter a valid Deposit amount.");
    }
  };

  // Withdraw amount
  const handleWithdraw = async () => {
    setIsWithdrawModalOpen(false);
    setIsLoadingWithdraw(true);
    if (!withdrawAmount || isNaN(withdrawAmount)) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }
    const amountInEth = parseFloat(withdrawAmount);
    console.log("Withdrawal Amount in Ether========", amountInEth);

    if (withdrawAmount > 0) {
      const apiUrlwithdraw = "http://localhost:3000/withdraw";
      const data = {
        amount: withdrawAmount,
      };

      axios
        .post(apiUrlwithdraw, data)
        .then((response) => {
          toast.success("Withdraw Amount Sucessfully");
          setWithdrawAmount("");
          // setIsWithdrawModalOpen(false);
        })
        .catch((error) => {
          console.error("Error fetching data from the API:", error);
          toast.error("Error withdrawing funds");
        })
        .finally(() => {
          setIsLoadingWithdraw(false);
        });
    } else {
      toast.error("Please enter a valid withdrawal amount.");
    }
  };

  // View History
  const handleViewHistoryClick = () => {
    navigate("/history");
  };

  // useEffect for get the Rate and User Balance
  useEffect(() => {
    // get Intrest Rate
    const apiUrlRate = "http://localhost:3000/getIntrestRate";
    axios
      .get(apiUrlRate)
      .then((response) => {
        setAprPercentage(response.data.IntrestRate);
      })
      .catch((error) => {
        console.error("Error fetching Rate from the API:", error);
      });

    // get userBalance
    const apiUrlbalance = "http://localhost:3000/getuserBalance";
    const data = {
      Address: connectedAccount,
    };
    axios
      .post(apiUrlbalance, data)
      .then((response) => {
        setTotalBalanceWithInterest(response.data.Balance);
      })
      .catch((error) => {
        console.error("Error fetching total balance with interest:", error);
      });
  }, [connectedAccount]);

  return (
    <div className="App">
      <h1>Simple Earn</h1>
      <TableContainer
        component={Paper}
        className="tablecontainer"
        sx={{ width: "1000px" }}
      >
        <Table>
          <TableHead className="tablehead" sx={{ backgroundColor: "#fef6d8" }}>
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
                    "&:hover": { border: "2px solid #cbb353" },
                  }}
                >
                  Flexible
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
                  onClick={handleOpenSubscribeModal}
                >
                  Subscribe
                </Button> */}
                {isLoadingDeposit ? (
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
                    onClick={handleOpenSubscribeModal}
                  >
                    Subscribe
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
                  onClick={handleOpenWithdrawModal}
                >
                  Withdraw
                </Button> */}

                {isLoadingWithdraw ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#fcd535",
                      ml: "10px",
                      color: "black",
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
                    onClick={handleOpenWithdrawModal}
                  >
                    Withdraw
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

            {/* Second Row (Bitcoin) */}
            {/* <TableRow sx={{ textAlign: "center" }}>
              <TableCell sx={{ fontSize: "20px" }}>
                <FontAwesomeIcon icon={faBitcoin} size="1.5x" /> BTC
              </TableCell>

              {aprPercentage !== null ? (
                <TableCell sx={{ color: "#0ba66d", fontSize: "20px" }}>
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
                    "&:hover": { border: "2px solid #cbb353" },
                  }}
                >
                  Flexible
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  className="subbutton"
                  sx={{
                    backgroundColor: "#fcd535",
                    color: "black",
                    "&:hover": { backgroundColor: "#cbb353" },
                  }}
                  onClick={handleOpenSubscribeModal}
                >
                  Subscribe
                </Button>
                <Button
                  className="withbutton"
                  sx={{
                    backgroundColor: "#fcd535",
                    ml: "10px",
                    color: "black",
                    "&:hover": { backgroundColor: "#cbb353" },
                  }}
                  onClick={handleOpenWithdrawModal}
                >
                  Withdraw
                </Button>
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
            </TableRow> */}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Subscribe Modal */}
      <CustomModal
        open={isSubscribeModalOpen}
        handleClose={handleCloseSubscribeModal}
        handleAction={handleSubscription}
        actionButtonText="Subscribe"
        amount={subscriptionAmount}
        onAmountChange={handleSubscriptionAmountChange}
        title=" Subscribe ETH"
        duration="Duration (Day)"
        total="Flexible"
      />

      {/* Withdraw Modal */}
      <CustomModal
        open={isWithdrawModalOpen}
        handleClose={handleCloseWithdrawModal}
        handleAction={handleWithdraw}
        actionButtonText="Withdraw"
        amount={withdrawAmount}
        onAmountChange={handleWithdrawAmountChange}
        title="Withdraw ETH"
        duration="Total Amount (ETH)"
        totalbalance={totalBalanceWithInterest}
      />
    </div>
  );
}

export default Earn;
