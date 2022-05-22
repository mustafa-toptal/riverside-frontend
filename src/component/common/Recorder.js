import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

import { Record } from "../../icons/Record";
import { Mic } from "../../icons/Mic";
import { Camera } from "../../icons/Camera";
import { Pause } from "../../icons/Pause";
import { Stop } from "../../icons/Stop";
import { Play } from "../../icons/Play";
import { Download } from "../../icons/Download";
import { Retake } from "../../icons/Retake";
import { AudioPlay, AudioRecorderWaves } from "../../icons/AudioWaves";
import Settings from "./partials/Settings";
import { DropdownArrow } from "../../icons/Setting";
import { isSafari } from "../../utils/Helpers";

const Recorder = (props) => {
  const [showCountDown, setShowCountDown] = useState(4);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [openSettings, setSettings] = useState(false);
  const [openAudio, setOpenAudio] = useState(false);
  const [mirrorChecked, setMirrorChecked] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);

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
          setTimer((seconds) => seconds + 100);
        }
      }, [100]);
    }
    return () => {
      clearInterval(timerInterval);
    };
  }, [props.isPaused, startTimer]);

  useEffect(() => {
    if (props.videoRef) {
      props.videoRef.current.addEventListener("loadeddata", () => {
        setVideoLoaded((val) => !val);
        console.log("videoLoaded", !videoLoaded);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.videoRef]);

  const getSeconds = () => {
    let milliseconds = parseInt((timer % 1000) / 100);
    let seconds = parseInt((timer / 1000) % 60);
    let minutes = parseInt((timer / (1000 * 60)) % 60);
    let hours = parseInt((timer / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + ":" + milliseconds + "0";
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

  const handleChangeRecordingType = () => {
    setOpenAudio(true);
    setSettings(false);
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
          <Typography
            variant="h1"
            sx={{
              width: "33px !important",
              marginLeft: showCountDown === 1 ? "5px !important" : 0,
            }}
          >
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
              transform:
                mirrorChecked && !(showCountDown > 0 && showCountDown <= 3)
                  ? "scaleX(-1)"
                  : "",
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
            transform: mirrorChecked ? "scaleX(-1)" : "",
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
          marginTop: props.isAudio
            ? "0"
            : props.isVideo && !isSafari && isVideoAvailable()
            ? "93px"
            : "-48px",
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
              {openAudio && (
                <Box
                  sx={{
                    width: "180px",
                    height: "170px",
                    borderRadius: "10px",
                    backgroundColor: "#232323",
                    position: "absolute",
                    left: props.videoDevices ? "30%" : "43.7%",
                    top: props.videoDevices
                      ? props.isVideo && !isSafari
                        ? "70.5%"
                        : "62.5%"
                      : props.isScreenOnly
                      ? "61.5%"
                      : "65.5%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }}
                >
                  {props.audioDevices &&
                    props.audioDevices.map((device) => {
                      return (
                        <Box
                          sx={{
                            height: "25px",
                            textOverflow: "ellipsis",
                            width: "80%",
                            overflow: "hidden",

                            marginLeft: "20px",
                            whiteSpace: "nowrap",
                            "&:hover": {
                              backgroundColor: "#393939",
                              borderRadius: "4px",
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => {
                            setOpenAudio(false);
                            props.setAudioDeviceId(device.deviceId);
                            props.setAudioLabelName(device.label);
                          }}
                        >
                          <Typography
                            variant="h12"
                            sx={{
                              width: "25px",

                              fontWeight: 400,
                              fontSize: "10px",
                              lineHeight: "10px",
                            }}
                            key={device.deviceId}
                          >
                            {device.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  <Box
                    sx={{
                      width: "180px",
                      height: "40px",
                      borderRadius: "0 0 10px 10px",
                      backgroundColor: "#232323",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => setOpenAudio((open) => !open)}
                  >
                    <Mic
                      sx={{ width: "14px", height: "22px", marginLeft: "20px" }}
                    />
                    <Typography
                      variant="h12"
                      sx={{
                        fontSize: "10px",
                        fontWeight: 400,
                        marginLeft: "10px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "80px",
                      }}
                    >
                      {props.audioLabelName}
                    </Typography>
                    <DropdownArrow
                      sx={{ width: "20px", height: "7px", marginLeft: "25px" }}
                    />
                  </Box>
                </Box>
              )}
              {(!openAudio || !props.videoDevices) && (
                <Box
                  sx={{
                    width: "180px",
                    height: "40px",
                    backgroundColor: "#232323",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "10px",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() =>
                    setOpenAudio((open) =>
                      props.audioDevices && props.audioDevices.length > 1
                        ? !open
                        : false
                    )
                  }
                >
                  <Mic
                    sx={{ width: "14px", height: "22px", marginLeft: "20px" }}
                  />
                  <Typography
                    variant="h12"
                    sx={{
                      fontSize: "10px",
                      fontWeight: 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginLeft: "10px",
                      width: "80px",
                    }}
                  >
                    {props.audioLabelName}
                  </Typography>
                  {props.audioDevices && props.audioDevices.length > 1 && (
                    <DropdownArrow
                      sx={{ width: "20px", height: "7px", marginLeft: "25px" }}
                    />
                  )}
                </Box>
              )}

              {/* {props.videoDevices && (
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
              )} */}
              {props.videoDevices && (
                <Box
                  sx={{
                    width: "180px",
                    height: "40px",
                    backgroundColor: "#232323",
                    display: "flex",
                    alignItems: "center",
                    borderRadius:
                      openVideo &&
                      props.videoDevices &&
                      props.videoDevices.length > 1
                        ? "0 0 10px 10px"
                        : "10px",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => setOpenVideo((open) => !open)}
                >
                  {openVideo &&
                    props.videoDevices &&
                    props.videoDevices.length > 1 && (
                      <Box
                        sx={{
                          width: "180px",
                          height: "130px",
                          borderRadius: "10px 10px 0 0",
                          backgroundColor: "#232323",
                          position: "absolute",
                          left: "55.50%",
                          top: props.videoDevices
                            ? props.isVideo && !isSafari
                              ? "70.5%"
                              : "63.5%"
                            : props.isScreenOnly
                            ? "61.5%"
                            : "65.5%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {props.videoDevices &&
                          props.videoDevices.map((device) => {
                            return (
                              <Box
                                sx={{
                                  height: "25px",
                                  textOverflow: "ellipsis",
                                  width: "80%",
                                  overflow: "hidden",

                                  marginLeft: "20px",
                                  whiteSpace: "nowrap",
                                  "&:hover": {
                                    backgroundColor: "#393939",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                  },
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenVideo(false);
                                  props.setVideoDeviceId(device.deviceId);
                                  props.setVideoLabelName(device.label);
                                }}
                              >
                                <Typography
                                  variant="h12"
                                  sx={{
                                    width: "25px",

                                    fontWeight: 400,
                                    fontSize: "10px",
                                    lineHeight: "10px",
                                  }}
                                  key={device.deviceId}
                                >
                                  {device.label}
                                </Typography>
                              </Box>
                            );
                          })}
                      </Box>
                    )}
                  <Camera
                    sx={{ width: "21px", height: "15px", marginLeft: "20px" }}
                  />
                  <Typography
                    variant="h12"
                    sx={{
                      fontSize: "10px",
                      fontWeight: 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginLeft: "10px",
                      width: "80px",
                    }}
                  >
                    {props.videoLabelName}
                  </Typography>
                  {props.videoDevices && props.videoDevices.length > 1 && (
                    <DropdownArrow
                      sx={{ width: "20px", height: "7px", marginLeft: "25px" }}
                    />
                  )}
                </Box>
              )}
            </Box>
            <Settings
              changeRecordingType={handleChangeRecordingType}
              setSettings={setSettings}
              isAudio={props.isAudio}
              openSettings={openSettings}
              marginLeft={props.videoDevices ? "90px" : "165px"}
              checked={mirrorChecked}
              setMirrorChecked={setMirrorChecked}
              retake={props.retake}
              isVideo={props.isVideo}
              setVideoResolution={props.setVideoResolution}
              videoResolution={props.videoResolution}
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
                <Typography
                  variant="h12"
                  sx={{ fontSize: "12px", fontWeight: 400, width: "70px" }}
                >
                  {getSeconds()}
                </Typography>
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

            <Settings
              setSettings={setSettings}
              isAudio={props.isAudio}
              openSettings={openSettings}
              marginLeft={"200px"}
              checked={mirrorChecked}
              setMirrorChecked={setMirrorChecked}
              retake={props.retake}
              changeRecordingType={handleChangeRecordingType}
            />
          </>
        )}
        {props.recordingAvailable && (
          <>
            <Box
              sx={{
                width: "240px",
                height: "40px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: "190px",
              }}
            >
              <Button
                sx={{
                  width: "112px",
                  height: "40px",
                  backgroundColor: "#232323",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  "&: hover": {
                    backgroundColor: "#656565",
                  },
                  textTransform: "none !important",
                }}
                onClick={props.downloadVideo}
                variant="default"
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
                  borderRadius: "10px",
                  color: "#FFFFFF",
                  "&: hover": {
                    backgroundColor: "#656565",
                  },
                  textTransform: "none !important",
                }}
                variant="default"
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
            <Settings
              setSettings={setSettings}
              isAudio={props.isAudio}
              openSettings={openSettings}
              marginLeft={"190px"}
              checked={mirrorChecked}
              setMirrorChecked={setMirrorChecked}
              retake={props.retake}
              changeRecordingType={handleChangeRecordingType}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Recorder;
