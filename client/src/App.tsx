import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import ErrorPage from "./pages/ErrorPage";
import SignInPage from "./pages/SignInPage";
import Root from "./components/Layout/Root";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ChatsList from "./components/Home/ChatsList";
import CreateChat from "./components/Home/CreateChat";
import Pages from "./components/Home/Pages";

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.ROOT,
        element: <HomePage />,
        children: [
          {
            path: ROUTES.CHATS_LIST,
            element: <ChatsList />,
          },
          {
            path: ROUTES.CREATE_GROUP,
            element: <CreateChat />,
          },
          {
            path: ROUTES.PAGES,
            element: <Pages />,
          },
          {
            path: ROUTES.FRIENDS,
            element: <Pages />,
          },
        ],
      },
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
