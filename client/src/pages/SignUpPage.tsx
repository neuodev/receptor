import React from "react";
import { Stack } from "@mui/material";
import SignUpForm from "../components/SignUp/SignUpForm";

const SignUpPage: React.FC<{}> = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100%",
      }}
    >
      <SignUpForm />
    </Stack>
  );
};

export default SignUpPage;
