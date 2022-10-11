import { Box, Stack } from "@mui/system";
import { Typography, Button, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const Pages = () => {
  const navigate = useNavigate();
  const PAGES = [
    {
      title: "Sign In",
      subtitle: "Sign in with another account",
      onClick: () => {
        navigate(ROUTES.SIGN_IN);
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
      title: "Sign out",
      subtitle: "Logout your current account",
      onClick: () => {
        navigate(ROUTES.SIGN_IN);
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
              <IconButton
                sx={{
                  bgcolor: "primary.main",
                  ":hover": {
                    bgcolor: "primary.main",
                  },
                }}
              >
                <ArrowForwardIosIcon
                  sx={{
                    color: "common.white",
                    width: "20px",
                    height: "20px",
                  }}
                />
              </IconButton>
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
