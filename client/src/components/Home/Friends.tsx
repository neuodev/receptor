import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useAppModal } from "../../state/app/hooks";
import { AppModal } from "../../state/app/reducer";
import { useAppSelector } from "../../store";
import Center from "../common/Center";
import ManageFriendsModal from "../Friends/ManageFriendsModal";
import { groupFriendsByFirstLetter, searchBy } from "../../utils/user";
import FriendCard from "../Friends/FriendCard";
import NoFriends from "../Friends/NoRoom";
import SearchInput from "../common/SearchInput";
import { IFriend } from "../../state/friends/reducer";

const Friends: React.FC<{}> = () => {
  const modal = useAppModal();
  const [search, setSearch] = useState<string>("");
  const friends = useAppSelector((state) => state.friends);
  const [filteredList, setFilteredList] = useState<IFriend[]>(friends.list);
  const friendsList = Object.entries(groupFriendsByFirstLetter(filteredList));

  useEffect(() => {
    setFilteredList(searchBy(search, friends.list, ["email", "username"]));
  }, [search, friends]);

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
        Friends
      </Typography>

      <SearchInput
        value={search}
        setValue={setSearch}
        placeholder="Search your friends..."
      />

      <Button
        onClick={() => modal.show(AppModal.AddFriend)}
        disableElevation
        endIcon={<PersonAddAltIcon />}
        variant="contained"
        fullWidth
        sx={{
          flexShrink: 0,
          mb: "20px",
          height: "50px",
          lineHeight: "1px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography>Manage friends</Typography>
      </Button>

      <Box sx={{ flexGrow: 1 }}>
        {friends.loading ? (
          <Center>
            <CircularProgress />
          </Center>
        ) : friends.error ? (
          <Center>
            <Typography color="error">{friends.error}</Typography>
          </Center>
        ) : friends.list.length === 0 ? (
          <Box sx={{ mt: "-20px", height: "100%" }}>
            <NoFriends />
          </Box>
        ) : (
          <Box>
            {friendsList.map(([letter, friends]) => (
              <Box key={letter}>
                <Typography
                  variant="caption"
                  color="grey.500"
                  textTransform="uppercase"
                  display="inline-block"
                  mb="8px"
                >
                  {letter}
                </Typography>
                {friends.map((f, idx) => (
                  <FriendCard key={f.id} friend={f} />
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <ManageFriendsModal />
    </Stack>
  );
};

export default Friends;
