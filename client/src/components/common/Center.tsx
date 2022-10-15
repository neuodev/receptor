import React from "react";
import { Stack } from "@mui/material";
const Center: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100%", width: "100%" }}
    >
      {children}
    </Stack>
  );
};

export default Center;
