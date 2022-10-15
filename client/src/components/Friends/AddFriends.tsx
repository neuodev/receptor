import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Input,
  Stack,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddFriendCard from "./AddFriendCard";
import { useAddFriend } from "../../state/addFriend/hooks";
import { useAppSelector } from "../../store";
import Center from "../common/Center";

const AddFriends = () => {
  const [search, setSearch] = useState<string>("");
  const { getUsersList } = useAddFriend();
  const currUser = useAppSelector((state) => state.user.info);
  const { users, loading, error } = useAppSelector(
    (state) => state.addFriend.usersList
  );

  useEffect(() => {
    getUsersList(search);
  }, [search]);

  return (
    <Box>
      <Typography variant="h5" mb="16px">
        Add Friend
      </Typography>

      <Input
        disableUnderline
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for friends..."
        sx={{
          p: "14px 18px 14px 14px",
          bgcolor: "grey.300",
          borderRadius: "0.6rem",
          mb: "20px",
        }}
        startAdornment={<SearchIcon sx={{ mr: "4px" }} />}
      />

      <Box sx={{ minHeight: "400px" }}>
        {loading ? (
          <Box sx={{ height: "370px" }}>
            <Center>
              <CircularProgress />
            </Center>
          </Box>
        ) : error ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        ) : (
          <Stack spacing={2}>
            {users
              .filter((u) => u.id !== currUser?.id)
              .map((user) => (
                <AddFriendCard key={user.id} user={user} />
              ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default AddFriends;
