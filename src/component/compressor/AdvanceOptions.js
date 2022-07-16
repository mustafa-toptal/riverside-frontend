import React from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";

function AdvanceOptions() {
  return (
    <Box
      sx={{
        marginTop: "20px",
        width: "840px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <Typography
          variant="subtitle"
          sx={{
            lineHeight: "24px",
            fontWeight: 700,
            fontSize: "20px",
          }}
        >
          Advanced Options
        </Typography>
        <Typography
          variant="subtitle"
          sx={{
            lineHeight: "20px",
            fontWeight: 400,
            fontSize: "14px",
            marginLeft: "5px",
          }}
        >
          (Optional)
        </Typography>
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "800",
            lineHeight: "16px",
            marginTop: "20px",
          }}
        >
          Video Codec
        </Typography>
        <Select
          sx={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            height: "40px",
            marginTop: "10px",
            "&:hover": {
              borderColor: "#c6ccd9",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#c6ccd9",
            },
            select: {
              "&:before": {
                borderColor: "#c6ccd9",
              },
            },
          }}
        >
          <MenuItem value="h264">H264</MenuItem>
          <MenuItem value="h265">H265</MenuItem>
        </Select>
        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: "400",
            lineHeight: "18px",
            marginTop: "5px",
            color: "rgba(55, 58, 65, 0.6)",
          }}
        >
          H265 codec can reduce video size 20-75% more compared to H264
          (especially high-resolution video)
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "20px"
        }}
      >
        <Box
          sx={{ backgroundColor: "red", width: "45%", height: "50px" }}
        ></Box>
        <Box
          sx={{ backgroundColor: "red", width: "45%", height: "50px"          }}
        ></Box>
      </Box>
    </Box>
  );
}

export default AdvanceOptions;
