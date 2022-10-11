import React from "react";
import { Typography, TextField, Button, Stack } from "@mui/material";
import Link from "../common/Link";
import { ROUTES } from "../../constants/routes";

const SignInForm = () => {
  const formFields = [
    {
      label: "Username",
    },
    {
      label: "Password",
    },
  ];

  return (
    <Stack direction="column" textAlign="center">
      <Stack
        direction="column"
        sx={{
          bgcolor: "common.white",
          boxShadow: 2,
          borderRadius: "0.6rem",
          padding: "1.5rem 1.5rem",
          minWidth: "350px",
        }}
      >
        <Typography variant="h6">Sign In</Typography>
        <Typography variant="overline" color="grey.700" mb="8px">
          Login to your account
        </Typography>

        <Stack direction="column">
          {formFields.map((field) => (
            <TextField
              label={field.label}
              key={field.label}
              sx={{ mb: "20px" }}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mb: "4px" }}
          >
            Sign In
          </Button>
        </Stack>
      </Stack>
      <Typography color="grey.500" mt="20px">
        Don't have an account yet? <Link to={ROUTES.REGISTER}>Sign up</Link>
      </Typography>
    </Stack>
  );
};

export default SignInForm;
