import React from "react";
import SignInForm from "../components/SignIn/SignInForm";
import { Stack } from "@mui/material";

const SignIn: React.FC<{}> = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100%",
      }}
    >
      <SignInForm />
    </Stack>
  );
};

export default SignIn;
