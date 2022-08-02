import React from "react";

import { Box, Typography } from "@mui/material";

import { DropdownIcon } from "../../icons/DropdownIcon";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";

const Dropdown = ({
  value = "Test",
  open = false,
  options = [],
  onChange = () => {},
  onClick = () => {},
  ...rest
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
      {...rest}
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
          textOverflow: "clip",
          overflow: "hidden",
          width: "80%",
          whiteSpace: "nowrap",
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
          id={"custom-dropdown"}
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
                  textOverflow: "clip",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
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
