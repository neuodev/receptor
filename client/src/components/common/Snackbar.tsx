import React from "react";
import Stack from "@mui/material/Stack";
import MuiSnackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Snackbar: React.FC<{
  open: boolean;
  onClose(): void;
  message: string | null;
  severity: AlertColor;
}> = ({ open, onClose, severity, message }) => {
  return (
    <Stack>
      <MuiSnackbar
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
      >
        <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </MuiSnackbar>
    </Stack>
  );
};

export default Snackbar;
