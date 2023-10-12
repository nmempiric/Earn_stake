import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogContentText,
  TextField,
  DialogActions,
  Typography,
  Divider,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

function CustomModal({
  open,
  handleClose,
  handleAction,
  actionButtonText,
  amount,
  onAmountChange,
  title,
  duration,
  total,
  totalbalance,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon icon={faEthereum} size="2x" />
          <Typography variant="h6" style={{ marginLeft: "8px" }}>
            {title}
          </Typography>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          <Typography variant="h6" gutterBottom>
            {duration}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {totalbalance}
          </Typography>
          {total && (<Button
            sx={{
              backgroundColor: "#fafafa",
              color: "black",
              variant: "outlined",
              border: "1px solid #cbb353",
              "&:hover": { border: "2px solid #cbb353" },
            }}
          >
            {total}
          </Button>)}
        </DialogContentText>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Enter Amount"
            type="number"
            fullWidth
            variant="standard"
            value={amount}
            onChange={onAmountChange}
          />
          <FontAwesomeIcon icon={faEthereum} size="2x" />  ETH
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "black" }}>
          Cancel
        </Button>
        <Button
          onClick={handleAction}
          variant="contained"
          sx={{
            backgroundColor: "#fcd535",
            color: "black",
            "&:hover": { backgroundColor: "#cbb353" },
          }}
        >
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomModal;
