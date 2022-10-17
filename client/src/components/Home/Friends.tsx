import React from "react";
import {
  Box,
  Input,
  Typography,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useAppModal } from "../../state/app/hooks";
import { AppModal } from "../../state/app/reducer";
import { useAppSelector } from "../../store";
import Center from "../common/Center";
import ManageFriendsModal from "../Friends/ManageFriendsModal";
import { groupFriendsByFirstLetter } from "../../utils/user";
import FriendCard from "../Friends/FriendCard";

const Friends: React.FC<{}> = () => {
  const modal = useAppModal();
  const friends = useAppSelector((state) => state.friends);
  const friendsList = Object.entries(groupFriendsByFirstLetter(friends.list));

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
        startAdornment={<SearchIcon sx={{ mr: "4px" }} />}
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
        ) : friendsList.length === 0 || true ? (
          <Center>
            <img src="./images/friends.png" />
          </Center>
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
