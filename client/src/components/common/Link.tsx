import React from "react";
import { Link as MuiLink } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Link: React.FC<{ to: string; children?: React.ReactNode }> = ({
  to,
  children,
}) => {
  const navigate = useNavigate();
  return (
    <MuiLink
      onClick={() => navigate(to)}
      sx={{ textDecoration: "none", cursor: "pointer" }}
    >
      {children}
    </MuiLink>
  );
};

export default Link;
