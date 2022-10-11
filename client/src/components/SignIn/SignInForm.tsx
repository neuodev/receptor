import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
} from "@mui/material";
import Link from "../common/Link";
import { ROUTES } from "../../constants/routes";
import { useUserHooks } from "../../state/user/hooks";

const SignInForm = () => {
  const { signIn } = useUserHooks();
  const [state, setState] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });

  type FormField = keyof typeof state;

  const formFields = [
    {
      label: "Username",
      name: "username",
    },
    {
      label: "Password",
      name: "password",
    },
  ];

  const updateState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as FormField;
    const value = e.target.value;
    setState({ ...state, [field]: value });
  };

  const signInHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password } = state;
    console.log(state);
    if (!username || !password) return;
    signIn(username, password);
  };

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

        <form onSubmit={signInHandler}>
          <Stack direction="column">
            {formFields.map((field) => (
              <TextField
                label={field.label}
                key={field.label}
                sx={{ mb: "20px" }}
                name={field.name}
                onChange={updateState}
              />
            ))}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mb: "4px" }}
              disabled={!state.username || !state.password}
            >
              Sign In
            </Button>
          </Stack>
        </form>
      </Stack>
      <Typography color="grey.500" mt="20px">
        Don't have an account yet? <Link to={ROUTES.REGISTER}>Sign up</Link>
      </Typography>
    </Stack>
  );
};

export default SignInForm;
