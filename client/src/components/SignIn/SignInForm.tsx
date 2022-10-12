import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";
import Link from "../common/Link";
import { ROUTES } from "../../constants/routes";
import { useUserHooks } from "../../state/user/hooks";
import { useAppSelector } from "../../store";
import OpenedEye from "@mui/icons-material/RemoveRedEye";
import ClosedEye from "@mui/icons-material/VisibilityOff";

const SignInForm = () => {
  const [showPass, setShowPass] = useState(false);
  const { signIn } = useUserHooks();
  const { loading, error } = useAppSelector((state) => state.user);
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
      type: "text",
    },
    {
      label: "Password",
      name: "password",
      type: showPass ? "text" : "password",
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
          padding: "1.5rem 1.5rem 2.3rem 1.5rem",
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
                type={field.type}
                InputProps={{
                  endAdornment:
                    field.name !== "password" ? undefined : (
                      <IconButton onClick={() => setShowPass(!showPass)}>
                        {showPass ? <OpenedEye /> : <ClosedEye />}
                      </IconButton>
                    ),
                }}
              />
            ))}
            <Button
              startIcon={
                loading && (
                  <CircularProgress
                    color="primary"
                    size="20px"
                    sx={{ ml: "-20px" }}
                  />
                )
              }
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mb: "4px" }}
              disabled={!state.username || !state.password || loading}
            >
              Sign In
            </Button>
            <Typography
              sx={{ height: "20px", mb: "-20px" }}
              variant="caption"
              color="error"
            >
              {error}
            </Typography>
          </Stack>
        </form>
      </Stack>
      <Typography color="grey.500" mt="20px">
        Don't have an account yet? <Link to={ROUTES.SIGN_UP}>Sign up</Link>
      </Typography>
    </Stack>
  );
};

export default SignInForm;
