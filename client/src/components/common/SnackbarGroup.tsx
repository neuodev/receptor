import React from "react";
import { AlertColor, Box } from "@mui/material";
import Snackbar from "./Snackbar";

const SnackbarGroup: React.FC<{
  list: Array<{
    open: boolean;
    onClose(): void;
    message: string | null;
    severity: AlertColor;
  }>;
}> = ({ list }) => {
  return (
    <Box>
      {list.map((item, idx) => (
        <Snackbar {...item} key={idx} />
      ))}
    </Box>
  );
};

export default SnackbarGroup;
