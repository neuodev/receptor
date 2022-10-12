import React from "react";
import { Box, Modal as MuiModal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Modal: React.FC<{
  open: boolean;
  onClose(): void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  return (
    <Box>
      <MuiModal
        open={open}
        onClose={onClose}
        disableEnforceFocus
        disableAutoFocus
      >
        <Box sx={style}>{children}</Box>
      </MuiModal>
    </Box>
  );
};

export default Modal;
