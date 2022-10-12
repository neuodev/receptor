import React from "react";
import LoginForm from "../components/Login/LoginForm";
import { Stack } from "@mui/material";

const LoginPage: React.FC<{}> = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100%",
      }}
    >
      <LoginForm />
    </Stack>
  );
};

export default LoginPage;
