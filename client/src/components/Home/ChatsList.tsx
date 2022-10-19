import { Stack, Typography, Input, Box, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAppSelector } from "../../store";
import Center from "../common/Center";
import ChatListItem from "../Chat/ChatListItem";
import NoFriends from "../Friends/NoFriends";
import GroupCard from "../Groups/GroupCard";

const ChatsList = () => {
  const friends = useAppSelector((state) => state.friends);
  const groups = useAppSelector((state) => state.groups.groups);

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
        {friends.loading || groups.loading ? (
          <Center>
            <CircularProgress />
          </Center>
        ) : friends.error || groups.error ? (
          <Center>
            <Typography color="error">
              {friends.error || groups.error}
            </Typography>
          </Center>
        ) : friends.list.length === 0 || groups.list.length === 0 ? (
          <Box sx={{ mt: "-20px", height: "100%" }}>
            <NoFriends />
          </Box>
        ) : (
          <Box>
            {groups.list.map((group) => (
              <GroupCard group={group} key={`group_${group.id}`} />
            ))}
            {friends.list.map((friend) => (
              <ChatListItem friend={friend} key={friend.id} />
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default ChatsList;
