import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ROUTES } from "../../constants/routes";
import Link from "../common/Link";
import { useUserHooks } from "../../state/user/hooks";
import { useAppSelector } from "../../store";
import OpenedEye from "@mui/icons-material/RemoveRedEye";
import ClosedEye from "@mui/icons-material/VisibilityOff";

const RegisterForm = () => {
  const { register } = useUserHooks();
  const { loading, error } = useAppSelector((state) => state.user);
  const [showPass, setShowPass] = useState(false);
  const [state, setState] = useState<{
    username: string;
    email: string;
    password: string;
  }>({
    username: "",
    email: "",
    password: "",
  });

  type FormField = keyof typeof state;

  const formFields = [
    {
      label: "Name",
      type: "text",
      name: "username",
    },
    {
      label: "Email",
      type: "text",
      name: "email",
    },
    {
      label: "Password",
      type: showPass ? "text" : "password",
      name: "password",
    },
  ];

  const updateState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as FormField;
    const value = e.target.value;
    setState({ ...state, [field]: value });
  };

  const isValidState = () => state.email && state.username && state.password;

  const registerHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidState()) return;
    register(state);
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
        <Typography variant="h6">Register</Typography>
        <Typography textTransform="none" variant="overline" color="grey.700">
          Follow the easy steps
        </Typography>

        <form onSubmit={registerHandler}>
          <Stack direction="column" mt="16px">
            {formFields.map((field) => (
              <TextField
                label={field.label}
                key={field.label}
                sx={{ mb: "20px" }}
                type={field.type}
                name={field.name}
                onChange={updateState}
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
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              sx={{ mb: "4px" }}
              disabled={!isValidState() || loading}
              startIcon={
                loading && (
                  <CircularProgress
                    color="primary"
                    size="20px"
                    sx={{ ml: "-20px" }}
                  />
                )
              }
            >
              Register
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
        Already have an account? <Link to={ROUTES.LOG_IN}>Log in</Link>
      </Typography>
    </Stack>
  );
};

export default RegisterForm;
