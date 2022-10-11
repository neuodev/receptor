import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import ErrorPage from "./pages/ErrorPage";
import SignInPage from "./pages/SignInPage";
import Root from "./components/Layout/Root";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.SIGN_IN,
        element: <SignInPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
