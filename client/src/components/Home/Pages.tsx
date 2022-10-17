import { Box, Stack } from "@mui/system";
import { Typography, Button, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useUserHooks } from "../../state/user/hooks";

const Pages = () => {
  const { logout } = useUserHooks();
  const navigate = useNavigate();
  const PAGES = [
    {
      title: "Sign In",
      subtitle: "Sign in with another account",
      onClick: () => {
        navigate(ROUTES.LOG_IN);
      },
    },
    {
      title: "Sign Up",
      subtitle: "Register a new account",
      onClick: () => {
        navigate(ROUTES.REGISTER);
      },
    },
    {
      title: "Log out",
      subtitle: "Logout your current account",
      onClick: () => {
        logout();
        navigate(ROUTES.LOG_IN);
      },
    },
  ];
  return (
    <Box>
      <Typography variant="h5" mb="32px">
        Other pages
      </Typography>

      <Stack>
        {PAGES.map((page) => (
          <Button
            onClick={page.onClick}
            endIcon={
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  bgcolor: "primary.main",
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                }}
              >
                <ArrowForwardIosIcon
                  sx={{
                    color: "common.white",
                    width: "20px",
                    height: "20px",
                  }}
                />
              </Stack>
            }
            key={page.title}
            variant="text"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "left",
              mb: "20px",
              bgcolor: "common.white",
              p: "20px 24px",
            }}
          >
            <Stack>
              <Typography variant="button" color="grey.900">
                {page.title}
              </Typography>
              <Typography variant="caption" color="grey.500">
                {page.subtitle}
              </Typography>
            </Stack>
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default Pages;
