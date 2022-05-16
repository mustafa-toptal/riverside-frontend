import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

import { Record } from "../../icons/Record";
import { Mic } from "../../icons/Mic";
import { Camera } from "../../icons/Camera";
import { Setting } from "../../icons/Setting";
import { Pause } from "../../icons/Pause";
import { Stop } from "../../icons/Stop";
import { Play } from "../../icons/Play";
import { Download } from "../../icons/Download";
import { Retake } from "../../icons/Retake";
import { AudioPlay, AudioRecorderWaves } from "../../icons/AudioWaves";

const Recorder = (props) => {
  const [showCountDown, setShowCountDown] = useState(4);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(0);

  const record = (e) => {
    let count = 3;
    setShowCountDown(3);
    const countInterval = setInterval(() => {
      count = count - 1;
      setShowCountDown((prev) => prev - 1);
      if (count === 0) {
        props.startRecording(e);
        setStartTimer(true);
        clearInterval(countInterval);
      }
    }, 1000);
  };

  useEffect(() => {
    let timerInterval = null;
    if (startTimer) {
      timerInterval = setInterval(() => {
        if (!props.isPaused) {
          setTimer((seconds) => seconds + 1);
        }
      }, [1000]);
    }
    return () => {
      clearInterval(timerInterval);
    };
  }, [props.isPaused, startTimer]);

  const getSeconds = () => {
    const result2 = new Date(timer * 1000).toISOString().slice(14, 19);
    return result2;
  };

  const isVideoAvailable = () => {
    return (
      (props.videoRef &&
        props.videoRef.current &&
        props.videoRef.current.srcObject) ||
      (props.recordedVideoRef &&
        props.recordedVideoRef.current &&
        props.recordedVideoRef.current.src)
    );
  };

  return (
    <Box sx={{ position: "relative" }}>
      {showCountDown > 0 && showCountDown <= 3 && (
        <Box
          sx={{
            borderRadius: "50%",
            width: "100px",
            height: "100px",
            backgroundColor: "#232323",
            position: "absolute",
            transform: "translate(-50%, 50%)",
            top: "25%",
            left: "50%",
            opacity: "90%",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h1" sx={{ width: "33px !important" }}>
            {showCountDown}
          </Typography>
        </Box>
      )}

      {props.isError && (
        <Box
          sx={{
            width: "250px",
            position: "absolute",
            transform: "translate(-50%, 50%)",
            top: "40%",
            left: "50%",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h12">
            {props.errorMessage
              ? props.errorMessage
              : "Grant access to start recording"}
          </Typography>
        </Box>
      )}
      {props.isAudio && (showCountDown <= 0 || showCountDown > 3) && (
        <Box
          sx={{
            width: "250px",
            position: "absolute",
            transform: "translate(-50%, 50%)",
            top: "25%",
            left: "50%",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          {props.recordingAvailable && (
            <AudioPlay
              sx={{
                width: "58px",
                height: "58px",
                position: "absolute",
              }}
            />
          )}
          <AudioRecorderWaves
            sx={{
              width: "221px",
              height: "78px",
              opacity: props.recordingAvailable ? "30%" : "1",
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          width: "753px",
          height: "471px",
          backgroundColor: props.isAudio
            ? "#9599FF"
            : !isVideoAvailable()
            ? "#000000"
            : "#161C21",
          borderRadius: "16px 16px 0 0",
          opacity: props.isAudio && props.recordingAvailable ? "30%" : "100%",
        }}
        onClick={props.playAudio}
      >
        {!props.recordingAvailable && !props.isAudio && (
          <video
            ref={props.videoRef}
            muted
            aspect
            style={{
              borderRadius: "16px 16px 0 0",
              width: "753px",
            }}
          />
        )}

        <video
          ref={props.recordedVideoRef}
          controls
          style={{
            borderRadius: "16px 16px 0 0",
            width: "100%",
            display:
              props.recordingAvailable && !props.isAudio ? "block" : "none",
          }}
        />

        <audio
          className="recorded-video"
          controls
          ref={props.recordedAudioRef}
          style={{ display: "none" }}
        />
      </Box>
      <Box
        sx={{
          width: "753px",
          height: "85px",
          borderRadius: "0 0 16px 16px",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          marginTop: props.isAudio ? "0" : "-48px",
        }}
      >
        <Typography
          variant="h12"
          sx={{
            marginLeft: "35px",
            fontSize: "10px",
            fontWeight: "400",
            lineHeight: "12px",
            textAlign: "left",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => window.location.reload()}
        >
          {"< Back"}
        </Typography>
        {!props.isRecording && !props.recordingAvailable && (
          <>
            <Box
              sx={{
                width: props.videoDevices ? "460px" : "300px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: props.videoDevices
                  ? "space-between"
                  : "space-evenly",
                marginLeft: props.videoDevices ? "70px" : "155px",
              }}
            >
              <Box
                sx={{
                  width: "80px",
                  height: "40px",
                  backgroundColor: "#FF3636",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={record}
              >
                <Record sx={{ width: "46px", height: "12px" }} />
              </Box>
              <Box
                sx={{
                  width: "180px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "#232323",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Mic sx={{ width: "14px", height: "22px" }} />
                <select
                  style={{
                    "-moz-appearance": "none",
                    "-webkit-appearance": "none",
                    appearance: "none",
                    border: "0px",
                    outline: "0px",
                    backgroundColor: "#232323",
                    width: "121px",
                    height: "18px",
                    color: "#FFFFFF",
                    cursor: "pointer",
                  }}
                  onChange={(e) => {
                    props.setAudioDeviceId(e.target.value);
                  }}
                >
                  {props.audioDevices &&
                    props.audioDevices.map((device) => {
                      return (
                        <option value={device.deviceId} key={device.deviceId}>
                          {device.label}
                        </option>
                      );
                    })}
                </select>
              </Box>
              {props.videoDevices && (
                <Box
                  sx={{
                    width: "180px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#232323",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Camera sx={{ width: "21px", height: "15px" }} />
                  <select
                    style={{
                      "-moz-appearance": "none",
                      "-webkit-appearance": "none",
                      appearance: "none",
                      border: "0px",
                      outline: "0px",
                      backgroundColor: "#232323",
                      width: "121px",
                      height: "18px",
                      color: "#FFFFFF",
                      cursor: "pointer",
                    }}
                    onChange={(e) => {
                      props.setVideoDeviceId(e.target.value);
                    }}
                  >
                    {props.videoDevices &&
                      props.videoDevices.map((device) => {
                        return (
                          <option value={device.deviceId} key={device.deviceId}>
                            {device.label}
                          </option>
                        );
                      })}
                  </select>
                </Box>
              )}
            </Box>
            <Setting
              sx={{
                width: "40px",
                height: "40px",
                marginLeft: props.videoDevices ? "90px" : "165px",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            />
          </>
        )}
        {props.isRecording && !props.recordingAvailable && (
          <>
            <Box
              sx={{
                width: "220px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginLeft: "200px",
              }}
            >
              <Box
                sx={{
                  width: "116px",
                  height: "40px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  color: "black",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#FF3636",
                  }}
                ></Box>
                <Typography variant="h12">{getSeconds()} </Typography>
              </Box>
              {!props.isPaused && (
                <Pause
                  sx={{
                    width: "40px",
                    height: "40px",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={props.pause}
                />
              )}
              {props.isPaused && (
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#232323",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={props.pause}
                >
                  <Play
                    sx={{
                      width: "10px",
                      height: "10px",
                    }}
                  />
                </Box>
              )}
              <Stop
                sx={{
                  width: "40px",
                  height: "40px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={props.stop}
              />
            </Box>
            <Setting
              sx={{
                width: "40px",
                height: "40px",
                marginLeft: "200px",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            />
          </>
        )}
        {props.recordingAvailable && (
          <Box
            sx={{
              width: "250px",
              height: "40px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: "160px",
            }}
          >
            <Button
              sx={{
                width: "112px",
                height: "40px",
                backgroundColor: "#232323",
                color: "#FFFFFF",
                "&: hover": {
                  backgroundColor: "#232323",
                },
              }}
              onClick={props.downloadVideo}
              type="default"
            >
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Download
                  sx={{
                    width: "12px",
                    height: "12px",
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "14.52px",
                    marginLeft: "10px",
                  }}
                >
                  Download
                </Typography>
              </Grid>
            </Button>
            <Button
              sx={{
                width: "112px",
                height: "40px",
                backgroundColor: "#232323",
                color: "#FFFFFF",
                "&: hover": {
                  backgroundColor: "#232323",
                },
              }}
              type="default"
              onClick={props.retake}
            >
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Retake
                  sx={{
                    width: "12px",
                    height: "12px",
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "14.52px",
                    marginLeft: "10px",
                  }}
                >
                  Retake
                </Typography>
              </Grid>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Recorder;
