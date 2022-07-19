import React from "react";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";
import Dropdown from "../common/Dropdown";
import { CheckBoxChecked, CheckBoxUnchecked } from "../../icons/CheckBox";

function AdvanceOptions(props) {
  const isMobile = useResponsiveQuery();

  const { options, setOptions, resetOptions, applySettings } = props;

  const getDynamicValues = (length) => {
    return Array.from({ length }, (_, idx) => `${++idx}`);
  };

  return (
    <Box
      sx={{
        marginTop: "20px",
        width: isMobile ? "343px" : "680px",
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
      }}
    >
      <Box>
        <Typography
          variant="subtitle"
          sx={{
            lineHeight: "24px",
            fontWeight: 800,
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
        <Dropdown
          value={options.codec}
          onChange={(e) => {
            setOptions((options) => {
              return { ...options, codec: e.target.value };
            });
          }}
        >
          <MenuItem
            sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
            value="h264"
          >
            H264
          </MenuItem>
          <MenuItem
            sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
            value="libx265"
          >
            H265
          </MenuItem>
        </Dropdown>
        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: "400",
            lineHeight: "14px",
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
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Box sx={{ width: isMobile ? "100%" : "49%" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "800",
              lineHeight: "16px",
            }}
          >
            Compression Method
          </Typography>
          <Dropdown
            value={options.method}
            onChange={(e) => {
              const value = e.target.value;
              setOptions((options) => {
                return {
                  ...options,
                  method: value,
                  compressValue:
                    value === "quality"
                      ? "21"
                      : value === "percent"
                      ? "60%"
                      : "",
                };
              });
            }}
          >
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="percent"
            >
              Target a file size (Percentage)
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="mb"
            >
              Target a file size (MB)
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="quality"
            >
              Target a video quality
            </MenuItem>
          </Dropdown>
          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: "400",
              lineHeight: "14px",
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
              lineHeight: "14px",
              color: "rgba(55, 58, 65, 0.6)",
            }}
          >
            Choose "Target a video quality" when quality is of importance.
          </Typography>
        </Box>
        <Box
          sx={{
            width: isMobile ? "100%" : "49%",
            marginTop: isMobile ? "20px" : "0px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "800",
              lineHeight: "16px",
            }}
          >
            {options.method === "quality"
              ? "Select Quality (CRF)"
              : "Select Target Size"}
          </Typography>
          {options.method === "percent" && (
            <Dropdown
              value={options.compressValue}
              onChange={(e) => {
                setOptions((options) => {
                  return { ...options, compressValue: e.target.value };
                });
              }}
            >
              {getDynamicValues(100).map((_, i) => {
                return (
                  <MenuItem
                    sx={{
                      fontSize: isMobile ? "16px" : "12px",
                      fontWeight: 400,
                    }}
                    value={`${i + 1}%`}
                  >
                    {i + 1}%
                  </MenuItem>
                );
              })}
            </Dropdown>
          )}
          {options.method === "quality" && (
            <Dropdown
              value={options.compressValue}
              onChange={(e) => {
                setOptions((options) => {
                  return { ...options, compressValue: e.target.value };
                });
              }}
            >
              {getDynamicValues(34).map((_, i) => {
                const val = i + 18;
                return (
                  <MenuItem
                    sx={{
                      fontSize: isMobile ? "16px" : "12px",
                      fontWeight: 400,
                    }}
                    value={`${val}`}
                  >
                    {val === 18
                      ? "18 Best quality - large size"
                      : val === 21
                      ? "21 Good quality - medium size (Default)"
                      : val === 28
                      ? "28 Okay quality - small size"
                      : val}
                  </MenuItem>
                );
              })}
            </Dropdown>
          )}
          {options.method === "mb" && (
            <TextField
              type="number"
              value={options.compressValue}
              onChange={(e) => {
                setOptions((options) => {
                  return { ...options, compressValue: e.target.value };
                });
              }}
              sx={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                height: "40px",
                marginTop: "10px",
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
          )}

          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: "400",
              lineHeight: "14px",
              marginTop: "5px",
              color: "rgba(55, 58, 65, 0.6)",
            }}
          >
            {options.method === "percent"
              ? `Select a target file size as a percentage of the original. Smaller values compress more. For example, a 100Mb file would become 25Mb if you select 25%.`
              : options.method === "mb"
              ? `Enter desired video file size in MB (Megabytes)`
              : `Higher CRF values compress more (at the expense of lower video quality)`}
          </Typography>
        </Box>
      </Box>
      {options.method === "quality" && (
        <Box sx={{ width: "100%", marginTop: "20px" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "800",
              lineHeight: "16px",
            }}
          >
            Compression Speed
          </Typography>
          <Dropdown
            value={options.speed}
            onChange={(e) => {
              setOptions((options) => {
                return { ...options, speed: e.target.value };
              });
            }}
          >
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="ultrafast"
            >
              Ultra fast
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="superfast"
            >
              Super fast
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="veryfast"
            >
              Very fast (Default)
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="faster"
            >
              Faster
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="fast"
            >
              Fast
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="medium"
            >
              Medium
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="slow"
            >
              Slow
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="slower"
            >
              Slower
            </MenuItem>
            <MenuItem
              sx={{ fontSize: isMobile ? "16px" : "12px", fontWeight: 400 }}
              value="veryslow"
            >
              Very Slow
            </MenuItem>
          </Dropdown>
          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: "400",
              lineHeight: "14px",
              color: "rgba(55, 58, 65, 0.6)",
              marginTop: "5px",
            }}
          >
            Slower speeds yield better compression/quality. We recommend "Very
            Fast" which balance both quality and speed.
          </Typography>
        </Box>
      )}
      <Box sx={{ width: isMobile ? "100%" : "65%" }}>
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
                color: "rgba(55, 58, 65, 1)",
                fontSize: "12px",
                fontWeight: 400,
                marginLeft: "14px",
                lineHeight: "16px",
              },
            }}
            control={
              options.oldDevices ? (
                <CheckBoxChecked
                  sx={{ width: "20px", height: "20px", marginLeft: "10px" }}
                  onClick={() => {
                    setOptions((options) => {
                      return { ...options, oldDevices: false };
                    });
                  }}
                />
              ) : (
                <CheckBoxUnchecked
                  sx={{ width: "20px", height: "20px", marginLeft: "10px" }}
                  onClick={() => {
                    setOptions((options) => {
                      return { ...options, oldDevices: true };
                    });
                  }}
                />
              )
            }
            label="Only use this option if you plan to play the video on a really old device or if you are having playback issues (it compress less)"
          />
        </FormGroup>
      </Box>
      <Box
        sx={{
          width: isMobile ? "100%" : "40%",
          marginTop: "20px",
          display: "flex",
          flexDirection: isMobile ? "column-reverse" : "row",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "start",
        }}
      >
        <Button
          onClick={applySettings}
          sx={{
            width: "55%",
            backgroundColor: "rgba(0, 0, 0, 1)",
            borderRadius: "10px",
            height: "50px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            },
            textTransform: "none",
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
            Apply settings
          </Typography>
        </Button>
        <Typography
          onClick={resetOptions}
          sx={{
            color: "rgba(35, 34, 35, 1)",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "18px",
            "&:hover": {
              textDecoration: "underline",
            },
            marginLeft: isMobile ? "0px" : "26px",
            marginBottom: isMobile ? "10px" : "0px",
            cursor: "pointer",
          }}
        >
          Reset all options
        </Typography>
      </Box>
    </Box>
  );
}

export default AdvanceOptions;
