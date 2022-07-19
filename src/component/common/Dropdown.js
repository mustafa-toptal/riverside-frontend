import React from "react";

import { Select } from "@mui/material";
import { DropdownIcon } from "../../icons/DropdownIcon";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";

function Dropdown({ children, onChange, value }) {
  const isMobile = useResponsiveQuery();
  return (
    <Select
      value={value}
      onChange={onChange}
      MenuProps={{
        PaperProps: {
          sx: {
            "& .MuiMenuItem-root.Mui-selected": {
              backgroundColor: "rgba(187, 188, 190, 0.3) !important",
            },

            "& .MuiMenuItem-root:hover": {
              backgroundColor: "rgba(187, 188, 190, 0.3)",
            },
            "& .MuiMenuItem-root.Mui-selected:hover": {
              backgroundColor: "rgba(187, 188, 190, 0.4) !important",
            },
          },
        },
      }}
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        height: "40px",
        marginTop: "10px",
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none !important",
        },
        "& .MuiOutlinedInput-input": {
          fontSize: isMobile ? "16px" : "12px",
          fontWeight: 400,
        },
      }}
      IconComponent={DropdownIcon}
    >
      {children}
    </Select>
  );
}

export default Dropdown;
