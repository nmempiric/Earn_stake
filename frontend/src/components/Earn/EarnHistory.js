import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function History({ connectedAccount }) {
  const [value, setValue] = useState(0);
  const [depositHistory, setDepositHistory] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [depositPage, setDepositPage] = useState(0);
  const [depositRowsPerPage, setDepositRowsPerPage] = useState(10);
  const [withdrawalPage, setWithdrawalPage] = useState(0);
  const [withdrawalRowsPerPage, setWithdrawalRowsPerPage] = useState(10);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeDepositPage = (event, newPage) => {
    setDepositPage(newPage);
  };

  const handleChangeDepositRowsPerPage = (event) => {
    setDepositRowsPerPage(parseInt(event.target.value, 10));
    setDepositPage(0);
  };

  const handleChangeWithdrawPage = (event, newPage) => {
    setWithdrawalPage(newPage);
  };

  const handleChangeWithdrawRowsPerPage = (event) => {
    setWithdrawalRowsPerPage(parseInt(event.target.value, 10));
    setWithdrawalPage(0);
  };

  useEffect(() => {
    // Deposit History
    const apiUrldeposithistory = "http://localhost:3000/depositHistory";
    const depositHistory = {
      Address: connectedAccount,
    };
    axios
      .post(apiUrldeposithistory, depositHistory)
      .then((response) => {
        if (response.data && Array.isArray(response.data.Data)) {
          setDepositHistory(response.data.Data);
        } else {
          console.error("Invalid data format received from the API");
        }
      })
      .catch((error) => {
        console.error("Error fetching deposit history:", error);
      });

    // Withdrawal History

    const apiUrlwithdrawhistory = "http://localhost:3000/withdrawHistory";
    const withdrawHistory = {
      Address: connectedAccount,
    };
    axios
      .post(apiUrlwithdrawhistory, withdrawHistory)
      .then((response) => {
        if (response.data && Array.isArray(response.data.Data)) {
          setWithdrawalHistory(response.data.Data);
        } else {
          console.error("Invalid data format received from the API");
        }
      })
      .catch((error) => {
        console.error("Error fetching withdrawal history:", error);
      });
  }, [connectedAccount]);

  return (
    <>
      <div className="App">
        <h1>Earning History</h1>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              //   textColor="warning"
              //   indicatorColor="warning"
              aria-label="basic tabs example"
            >
              <Tab label="Subscribe" {...a11yProps(0)} />
              <Tab label="Withdraw" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount (ETH)</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {depositHistory
                    .slice(
                      depositPage * depositRowsPerPage,
                      depositPage * depositRowsPerPage + depositRowsPerPage
                    )
                    .map((deposit, index) => (
                      <TableRow key={index}>
                        <TableCell>{deposit.amount} ETH</TableCell>
                        <TableCell>{deposit.timestamp}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={100}
                page={depositPage}
                onPageChange={handleChangeDepositPage}
                rowsPerPage={depositRowsPerPage}
                onRowsPerPageChange={handleChangeDepositRowsPerPage}
              />
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount (ETH)</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawalHistory
                    .slice(
                      withdrawalPage * withdrawalRowsPerPage,
                      withdrawalPage * withdrawalRowsPerPage +
                        withdrawalRowsPerPage
                    )
                    .map((withdraw, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {withdraw.amount} ETH
                        </TableCell>
                        <TableCell>
                          {withdraw.timestamp}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={100}
                page={withdrawalPage}
                onPageChange={handleChangeWithdrawPage}
                rowsPerPage={withdrawalRowsPerPage}
                onRowsPerPageChange={handleChangeWithdrawRowsPerPage}
              />
            </TableContainer>
          </CustomTabPanel>
        </Box>
      </div>
    </>
  );
}
