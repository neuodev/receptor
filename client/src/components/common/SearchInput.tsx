import React from "react";
import { Input, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchInput: React.FC<{
  value: string;
  setValue(value: string): void;
  placeholder: string;
}> = ({ value, setValue, placeholder }) => {
  return (
    <Input
      disableUnderline
      fullWidth
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      sx={{
        p: "14px 18px 14px 14px",
        bgcolor: "grey.300",
        borderRadius: "0.6rem",
        mb: "20px",
      }}
      startAdornment={<SearchIcon sx={{ mr: "4px" }} />}
      endAdornment={
        <IconButton
          disabled={!value}
          sx={{
            width: "30px",
            height: "30px",
          }}
          onClick={() => setValue("")}
        >
          <CloseIcon />
        </IconButton>
      }
    />
  );
};

export default SearchInput;
