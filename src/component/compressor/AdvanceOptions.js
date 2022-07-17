import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

function AdvanceOptions() {
  return (
    <Box
      sx={{
        marginTop: "20px",
        width: "840px",
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px"
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
          marginTop: "20px",
        }}
      >
        <Box sx={{ width: "45%" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "800",
              lineHeight: "16px",
            }}
          >
            Compression Method
          </Typography>
          <Select
            sx={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              height: "40px",
              marginTop: "10px",
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
            Choose "Target a file size" to get an exact output file size.
          </Typography>
          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: "400",
              lineHeight: "18px",
              color: "rgba(55, 58, 65, 0.6)",
            }}
          >
            Choose "Target a video quality" when quality is of importance.
          </Typography>
        </Box>
        <Box sx={{ width: "45%" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "800",
              lineHeight: "16px",             
            }}
          >
            Select Target Size
          </Typography>
          <Select
            sx={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              height: "40px",
              marginTop: "10px",
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
            Select a target file size as a percentage of the original. Smaller
            values compress more. For example, a 100Mb file would become 25Mb if
            you select 25%.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: "60%" }}>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "800",
            lineHeight: "16px",
            marginTop: "20px",
          }}
        >
          Make video compatible with old devices?
        </Typography>
        <FormGroup>
          <FormControlLabel
            sx={{
              marginTop: "14px",
              "& .MuiFormControlLabel-label": {
                color: "rgba(55, 58, 65, 0.6)",
                fontSize: "14px",
                fontWeight: 400,
              },
            }}
            control={
              <Checkbox
                sx={{
                  borderRadius: "4px",
                  color: "#c6ccd9",
                  "&.Mui-checked": {
                    color: "#9599FF",
                  },
                }}
              />
            }
            label="Only use this option if you plan to play the video on a really old device or if you are having playback issues (it compress less)"
          />
        </FormGroup>
      </Box>
      <Box sx={{ width: "40%", marginTop: "20px", display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Button
          sx={{
            width: "55%",
            backgroundColor: "rgba(0, 0, 0, 1)",
            borderRadius: "10px",
            height: "50px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "12px",
              lineHeight: "18px",
            }}
          >
            Apply from preset
          </Typography>
        </Button>
        <Typography
            sx={{
              color: "rgba(35, 34, 35, 1)",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              textDecoration: "underline",
              marginLeft: "26px",
              cursor: "pointer"
            }}
          >
            Reset all options
          </Typography>
      </Box>
    </Box>
  );
}

export default AdvanceOptions;
