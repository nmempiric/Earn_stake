import React, { useEffect, useState } from "react";
import "./App.css";
import { AppBar, Button, Toolbar, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { Routes, Route, Link } from "react-router-dom";
import Earn from "../src/components/Earn/Earn";
import Stake from "./components/Stake/Stake";
import EarnHitory from "./components/Earn/EarnHistory";
import StakeHistory from "./components/Stake/StakeHistory";

function formatAddress(address) {
  if (!address) return "";
  const start = address.substring(0, 6);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
}

function App() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const storedAccount = localStorage.getItem("connectedAccount");
    if (storedAccount) {
      setConnectedAccount(storedAccount);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected to wallet. Accounts:", accounts);
        if (accounts.length > 0) {
          const connectedAddress = accounts[0];
          setConnectedAccount(connectedAddress);
  
          // Store the connected account in localStorage
          localStorage.setItem("connectedAccount", connectedAddress);
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("Ethereum wallet not detected.");
    }
  };
  
  
  const disconnectWallet = () => {
    setConnectedAccount(null);
    setAnchorEl(null);

    // Clear the connected account from localStorage
    localStorage.removeItem("connectedAccount");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" className="navbar" sx={{ backgroundColor: "#ffffff" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "black",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#f1bf1f")}
              onMouseLeave={(e) => (e.target.style.color = "black")}
            >
              Earn
            </Link>
            <Link
              to="/stake"
              style={{
                textDecoration: "none",
                color: "black",
                marginLeft: "20px",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#f1bf1f")}
              onMouseLeave={(e) => (e.target.style.color = "black")}
            >
              Stack
            </Link>
          </div>

          {connectedAccount ? (
            <div>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#cbb353",
                  color: "black",
                  "&:hover": { backgroundColor: "#f1bf1f" },
                }}
                startIcon={<AccountCircle />}
                onClick={handleMenuClick}
              >
                {formatAddress(connectedAccount)}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={disconnectWallet}>Disconnect</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={connectWallet}
              sx={{
                backgroundColor: "#f1bf1f",
                color: "black",
                "&:hover": { backgroundColor: "#cbb353" },
              }}
            >
              Connect Wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Earn connectedAccount={connectedAccount} />} />
        <Route path="/history" element={<EarnHitory connectedAccount={connectedAccount} />} />
        <Route path="/stake" element={<Stake />} />
        <Route path="/stakehistory" element={<StakeHistory connectedAccount={connectedAccount} />} />
      </Routes>
    </>
  );
}

export default App;
