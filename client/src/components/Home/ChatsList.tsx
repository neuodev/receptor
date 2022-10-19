import { Stack, Typography, Input, Box, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Center from "../common/Center";
import FriendChat from "../Chat/FriendChat";
import GroupChat from "../Chat/GroupChat";
import NoChat from "../Friends/NoFriends";
import { useChat } from "../../hooks/ui/chat";

const ChatsList = () => {
  // const friends = useAppSelector((state) => state.friends);
  // const groups = useAppSelector((state) => state.groups.groups);
  const { loading, error, chatsList } = useChat();

  return (
    <Stack
      sx={{
        height: "100%",
        overflowY: "scroll",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography variant="h5" mb="32px">
        Chat
      </Typography>

      <Input
        disableUnderline
        fullWidth
        placeholder="Search messages or friends"
        sx={{
          p: "14px 18px 14px 14px",
          bgcolor: "grey.300",
          borderRadius: "0.6rem",
          mb: "15px",
        }}
        startAdornment={<SearchIcon sx={{ mr: "4px", color: "grey.500" }} />}
      />

      <Box sx={{ flexGrow: 1 }}>
        {loading ? (
          <Center>
            <CircularProgress />
          </Center>
        ) : error ? (
          <Center>
            <Typography color="error">{error}</Typography>
          </Center>
        ) : chatsList.length === 0 ? (
          <Box sx={{ mt: "-20px", height: "100%" }}>
            <NoChat />
          </Box>
        ) : (
          <Box>
            {chatsList.map((chat) =>
              chat.isGroup ? (
                <GroupChat chat={chat} />
              ) : (
                <FriendChat chat={chat} />
              )
            )}
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default ChatsList;
