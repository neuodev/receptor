import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useRouteError, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as { statusText?: string; message: string };
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1" sx={{ mb: "20px" }}>
        Oops!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: "12px",
        }}
      >
        Sorry, an unexpected error has occurred
      </Typography>
      <Typography variant="caption" color="grey.500">
        {error.statusText || error.message}
      </Typography>

      <Button
        onClick={() => navigate("/")}
        size="large"
        variant="outlined"
        sx={{ mt: "20px" }}
      >
        Home Screen
      </Button>
    </Box>
  );
};

export default ErrorPage;
