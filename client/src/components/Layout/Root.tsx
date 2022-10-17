import { Outlet } from "react-router-dom";
import { Box } from "@mui/system";
import { useServerEvents } from "../../wss/appSocket";
import { useFriends } from "../../state/friends/hooks";

const Root = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "rgba(var(--bs-light-rgb), 1)",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default Root;
