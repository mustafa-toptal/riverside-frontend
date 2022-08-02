import React from "react";

import { Box, Select, Typography } from "@mui/material";
import { DropdownIcon } from "../../icons/DropdownIcon";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";

export function Dropdowns({ children, onChange, value }) {
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

const Dropdown = ({
  value = "Test",
  open = false,
  options = [],
  onChange = () => {},
  onClick = () => {},
}) => {
  const isMobile = useResponsiveQuery();
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        height: "40px",
        marginTop: "10px",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={onClick}
    >
      <DropdownIcon
        sx={{
          float: "right",
          marginTop: "8px",
          marginRight: "16.5px",
          width: "12px",
        }}
      />
      <Typography
        sx={{
          fontSize: isMobile ? "16px" : "12px",
          fontWeight: 400,
          padding: "10px 10px 0px 13px",
          textTransform: "capitalize",
        }}
      >
        {options &&
        options.length &&
        options.filter((data) => data.value == value).length
          ? options.filter((data) => data.value == value)[0].name
          : value}
      </Typography>
      {open && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 9999999,
            width: "100%",
            backgroundColor: "#FFFFFF",
            marginTop: "15px",
            borderRadius: "4px",
            boxShadow: "0 3px 10px rgb(0 0 0 / 30%)",
            maxHeight: "200px",
            overflowY: options && options.length > 7 ? "scroll" : "none",
          }}
        >
          {options.map((data, index) => {
            return (
              <Typography
                onClick={() => {
                  onChange(data.value);
                  onClick();
                }}
                sx={{
                  fontSize: isMobile ? "16px" : "12px",
                  fontWeight: 400,
                  padding: `10px 10px ${isMobile ? "10px" : "0px"} 13px`,
                  textTransform: "capitalize",
                  marginBottom: index === options.length - 1 ? "5px" : "",
                  height: "25px",
                  "&:hover": {
                    backgroundColor: "rgba(187, 188, 190, 0.3)",
                  },
                  backgroundColor:
                    data.value === value ? "rgba(187, 188, 190, 0.3)" : "",
                }}
              >
                {data.name}
              </Typography>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Dropdown;
