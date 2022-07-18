import React from "react";

import { Select } from "@mui/material";
import { DropdownIcon } from "../../icons/DropdownIcon";

function Dropdown({ children, onChange, value }) {
  return (
    <Select
      value={value}
      onChange={onChange}
      MenuProps={{
        PaperProps: {
          sx: {
            "& .MuiMenuItem-root.Mui-selected": {
              backgroundColor: "#C6CCD9 !important",
            },

            "& .MuiMenuItem-root:hover": {
              backgroundColor: "rgba(187, 188, 190, 0.3)",
            },
            "& .MuiMenuItem-root.Mui-selected:hover": {
              backgroundColor: "rgba(187, 188, 190, 0.3)",
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
      }}
      IconComponent = {DropdownIcon}
     >
      {children}
    </Select>
  );
}

export default Dropdown;
