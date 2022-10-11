import React from "react";
import { Typography, TextField, Button, Stack } from "@mui/material";
import { ROUTES } from "../../constants/routes";
import Link from "../common/Link";

const RegisterForm = () => {
  const formFields = [
    {
      label: "Name",
      type: "text",
      name: "name",
    },
    {
      label: "Email",
      type: "text",
      name: "email",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
    },
  ];

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
        <Typography variant="h6">Sign Up</Typography>
        <Typography textTransform="none" variant="overline" color="grey.700">
          Follow the easy steps
        </Typography>

        <Stack direction="column" mt="16px">
          {formFields.map((field) => (
            <TextField
              label={field.label}
              key={field.label}
              sx={{ mb: "20px" }}
              type={field.type}
              name={field.name}
            />
          ))}

          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mb: "4px" }}
          >
            Register
          </Button>
        </Stack>
      </Stack>
      <Typography color="grey.500" mt="20px">
        Already have an account? <Link to={ROUTES.SIGN_IN}>Sign in</Link>
      </Typography>
    </Stack>
  );
};

export default RegisterForm;
