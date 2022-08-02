import React, { useState } from "react";
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
import { Check } from "../../icons/Check";

function AdvanceOptions(props) {
  const isMobile = useResponsiveQuery();
  const [showIsApplied, setShowIsApplied] = useState(false);
  const [isSettingRestored, setIsSettingRestored] = useState(false);

  const {
    options,
    setOptions,
    resetOptions,
    applySettings,
    openCompressionMethod,
    setOpenCompressionMethod,
    openCodec,
    setOpenCodec,
    openQuality,
    setOpenQuality,
    openSpeed,
    setOpenSpeed,
  } = props;

  const getDynamicValues = (length) => {
    return Array.from({ length }, (_, idx) => `${++idx}`);
  };

  const setSettings = () => {
    setShowIsApplied(true);
    applySettings();
    setTimeout(() => {
      setShowIsApplied(false);
    }, 1000);
  };

  const restoreOptions = () => {
    setIsSettingRestored(true);
    resetOptions();
    setTimeout(() => {
      setIsSettingRestored(false);
    }, 1000);
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
          open={openCodec}
          value={options.codec}
          onChange={(e) => {
            setOptions((options) => {
              return { ...options, codec: e };
            });
            setOpenCodec(false);
          }}
          onClick={(e) => {
            if (e && e.stopPropagation) {
              e.stopPropagation();
            }
            setOpenCodec((prev) => !prev);
            setOpenCompressionMethod(false);
            setOpenQuality(false);
            setOpenSpeed(false);
          }}
          options={[
            { name: "H264", value: "h264" },
            { name: "H265", value: "libx265" },
          ]}
        />
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
            open={openCompressionMethod}
            value={options.method}
            onClick={(e) => {
              if (e && e.stopPropagation) {
                e.stopPropagation();
              }
              setOpenCompressionMethod((prev) => !prev);
              setOpenCodec(false);
              setOpenQuality(false);
              setOpenSpeed(false);
            }}
            onChange={(e) => {
              const value = e;
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
              setOpenCompressionMethod(false);
            }}
            options={[
              { name: "Target a file size (Percentage)", value: "percent" },
              { name: "Target a file size (MB)", value: "mb" },
              { name: "Target a video quality", value: "quality" },
            ]}
          />
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
          {(options.method === "percent" || options.method === "quality") && (
            <Dropdown
              open={openQuality}
              value={options.compressValue}
              onChange={(e) => {
                setOptions((options) => {
                  return { ...options, compressValue: e };
                });
                setOpenQuality(false);
              }}
              onClick={(e) => {
                if (e && e.stopPropagation) {
                  e.stopPropagation();
                }
                setOpenCompressionMethod(false);
                setOpenCodec(false);
                setOpenQuality((prev) => !prev);
                setOpenSpeed(false);
              }}
              options={
                options.method === "percent"
                  ? getDynamicValues(100).map((_, i) => {
                      return { value: `${i + 1}%`, name: `${i + 1}%` };
                    })
                  : options.method === "quality"
                  ? getDynamicValues(34).map((_, i) => {
                      const val = i + 18;
                      const name =
                        val === 18
                          ? "18 Best quality - large size"
                          : val === 21
                          ? "21 Good quality - medium size (Default)"
                          : val === 28
                          ? "28 Okay quality - small size"
                          : val;
                      return { name, value: val };
                    })
                  : []
              }
            />
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
                "& .MuiOutlinedInput-input": {
                  fontSize: isMobile ? "16px !important" : "12px !important",
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
            open={openSpeed}
            value={options.speed}
            onChange={(e) => {
              setOptions((options) => {
                return { ...options, speed: e };
              });
              setOpenSpeed(false);
            }}
            onClick={(e) => {
              if (e && e.stopPropagation) {
                e.stopPropagation();
              }
              setOpenCompressionMethod(false);
              setOpenCodec(false);
              setOpenQuality(false);
              setOpenSpeed((prev) => !prev);
              document.getElementById("custom-dropdown").scrollIntoView();
            }}
            options={[
              { name: "Ultra fast", value: "ultrafast" },
              { name: "Super fast", value: "superfast" },
              { name: "Very fast (Default)", value: "veryfast" },
              { name: "Faster", value: "faster" },
              { name: "Fast", value: "fast" },
              { name: "Medium", value: "medium" },
              { name: "Slow", value: "slow" },
              { name: "Slower", value: "slower" },
              { name: "Very Slow", value: "veryslow" },
            ]}
          />
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
          onClick={setSettings}
          sx={{
            width: "55%",
            backgroundColor: showIsApplied ? "#31343C" : "rgba(0, 0, 0, 1)",
            borderRadius: "10px",
            height: "50px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            },
            textTransform: "none",
            display: "flex",
            alignItems: "center",
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
            {!showIsApplied ? "Apply settings" : "Setting applied"}
          </Typography>
          {showIsApplied ? (
            <Check sx={{ width: "19px", height: "19px", marginLeft: "5px" }} />
          ) : (
            ""
          )}
        </Button>
        <Typography
          onClick={restoreOptions}
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
          {isSettingRestored ? "Option restored" : "Reset all options"}
        </Typography>
      </Box>
    </Box>
  );
}

export default AdvanceOptions;
