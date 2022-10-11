import React from "react";
import { Typography, TextField, Button, Stack } from "@mui/material";

const SignInForm = () => {
  return (
    <Stack direction="column" textAlign="center">
      <Stack
        direction="column"
        sx={{
          bgcolor: "white",
          boxShadow: 2,
          borderRadius: "0.6rem",
          padding: "1.5rem 1.5rem",
          minWidth: "350px",
        }}
      >
        <Typography variant="h6">Sign In</Typography>
        <Typography variant="overline" color="grey.700">
          Login to your account
        </Typography>

        <Stack direction="column">
          <TextField label="Username" variant="filled" sx={{ my: "20px" }} />
          <TextField label="Password" variant="filled" />
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: "20px", mb: "4px" }}
          >
            Sign In
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SignInForm;
