import { useState, useEffect } from "react";
import { Stack, Typography, Box, CircularProgress } from "@mui/material";
import Center from "../common/Center";
import FriendRoom from "../Room/FriendRoom";
import GroupRoom from "../Room/GroupRoom";
import NoRoom from "../Friends/NoRoom";
import { IRoom, useRoom } from "../../state/messages/hooks";
import { searchBy } from "../../utils/user";
import SearchInput from "../common/SearchInput";

const ChatsList = () => {
  const { loading, error, rooms } = useRoom();
  const [filteredList, setFilteredList] = useState<IRoom[]>(rooms);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setFilteredList(searchBy(search, rooms, ["email", "name"]));
  }, [search, loading, error]);

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

      <SearchInput
        value={search}
        setValue={setSearch}
        placeholder="Search your friends..."
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
        ) : rooms.length === 0 ? (
          <Box sx={{ mt: "-20px", height: "100%" }}>
            <NoRoom />
          </Box>
        ) : (
          <Box>
            {filteredList.map((room) =>
              room.isGroup ? (
                <GroupRoom group={room} />
              ) : (
                <FriendRoom friend={room} />
              )
            )}
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default ChatsList;