import React from "react";
import { Stack } from "@mui/material";
import RegisterForm from "../components/Register/RegisterForm";

const RegisterPage: React.FC<{}> = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100%",
      }}
    >
      <RegisterForm />
    </Stack>
  );
};

export default RegisterPage;
