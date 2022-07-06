import React, { useState, useEffect, useRef } from "react";
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
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";

const Recorder = (props) => {
  const [showCountDown, setShowCountDown] = useState(4);
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [openSettings, setSettings] = useState(false);
  const [openAudio, setOpenAudio] = useState(false);
  const [mirrorChecked, setMirrorChecked] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [containerHeight, setContainerHeight] = useState(471);
  const isMobile = useResponsiveQuery();

  const intervalRef = useRef();

  useEffect(() => {
    if (isMobile) {
      document.getElementById("root").style.alignItems = "flex-start";
    } else {
      document.getElementById("root").style.alignItems = "center";
    }
  }, [isMobile]);

  const record = (e) => {
    let count = 3;
    setShowCountDown(3);
    const countInterval = setInterval(() => {
      count = count - 1;
      setShowCountDown((prev) => prev - 1);
      if (count === 0) {
        console.log("Count is 0");
        props.startRecording(e);
        setStartTimer(true);
        clearInterval(countInterval);
      }
    }, 1000);
  };

  useEffect(() => {
    if (props.audioLabelName) {
      setOpenAudio(false);
    }
  }, [props.audioLabelName]);

  useEffect(() => {
    if (props.videoLabelName) {
      setOpenVideo(false);
    }
  }, [props.videoLabelName]);

  useEffect(() => {
    if (startTimer) {
      intervalRef.current = setInterval(() => {
        if (!props.isPaused) {
          setTimer((seconds) => seconds + 100);
        }
      }, [100]);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [props.isPaused, startTimer]);

  useEffect(() => {
    if (props.videoRef) {
      props.videoRef.current.addEventListener("loadeddata", () => {
        setContainerHeight(props.videoRef.current.clientHeight);
        setVideoLoaded((val) => !val);
        console.log("videoLoaded", !videoLoaded);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.videoRef]);

  useEffect(() => {
    if (props.recordedVideoRef) {
      props.recordedVideoRef.current.addEventListener("loadeddata", () => {
        setContainerHeight(props.recordedVideoRef.current.clientHeight);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.recordedVideoRef]);

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

  const onClickStop = () => {
    props.stop();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimer(0);
    setStartTimer(false);
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

  const changeSelectedAudio = (device) => {
    setOpenAudio(false);
    props.setAudioDeviceId(device.deviceId);
    props.setAudioLabelName(device.label);
  };

  return (
    <Box sx={{ position: "relative", ...(isMobile && { width: "100vw" }) }}>
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
            top: "32%",
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
          width: isMobile ? "100%" : "753px",
          height:
            props.isAudio && isMobile
              ? `calc(100vh - 135px)`
              : `${containerHeight}px`,
          backgroundColor: props.isAudio ? "#9599FF" : "#000000",
          borderRadius: isMobile ? "0" : "16px 16px 0 0",
          opacity: props.isAudio && props.recordingAvailable ? "30%" : "100%",
        }}
        onClick={props.playAudio}
      >
        {!props.recordingAvailable && !props.isAudio && (
          <video
            ref={props.videoRef}
            muted
            aspect
            id="stream-video"
            style={{
              borderRadius: isMobile ? "0" : "16px 16px 0 0",
              width: isMobile ? "100%" : "753px",
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
            borderRadius: isMobile ? "0" : "16px 16px 0 0",
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
          width: isMobile ? "100%" : "753px",
          height: "85px",
          borderRadius: "0 0 16px 16px",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          marginTop: 0,
          ...(isMobile && {
            justifyContent: "center",
          }),
        }}
      >
        <Box
          sx={{
            marginLeft: "10px",
            padding: "0 16px",
            height: "40px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "#656565",
            },
            ...(isMobile && {
              position: "fixed",
              top: "0",
              left: "0",
              marginTop: "10px",
            }),
          }}
          onClick={() => window.location.reload()}
        >
          <Typography
            variant="h12"
            sx={{
              fontSize: "0.825rem",
              fontWeight: "400",
              lineHeight: "12px",
              textAlign: "left",
            }}
          >
            {"< Back"}
          </Typography>
        </Box>
        {!props.isRecording && !props.recordingAvailable && (
          <>
            <Box
              sx={{
                width:
                  isMobile && props.isVideo && !openAudio && !openVideo
                    ? "220px"
                    : props.videoDevices
                    ? "460px"
                    : "300px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent:
                  isMobile && props.isVideo
                    ? "space-evenly"
                    : props.videoDevices
                    ? "space-between"
                    : "space-evenly",
                marginLeft: isMobile
                  ? "0"
                  : props.videoDevices
                  ? "70px"
                  : "155px",
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
              {!!props.audioDevices.length && (
                <Box
                  sx={{
                    width:
                      isMobile && props.isVideo && !openAudio
                        ? "60px"
                        : "180px",
                    height: "40px",
                    backgroundColor: "#232323",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: openAudio ? "0 0 10px 10px" : "10px",
                    "&:hover": {
                      cursor: "pointer",
                    },
                    position: "relative",
                  }}
                  onClick={() => {
                    setOpenVideo(false);
                    setOpenAudio((open) =>
                      props.audioDevices && props.audioDevices.length > 1
                        ? !open
                        : false
                    );
                  }}
                >
                  <Mic
                    sx={{
                      width: "14px",
                      height: "22px",
                      marginLeft:
                        isMobile && props.isVideo && !openAudio
                          ? "11px"
                          : "20px",
                    }}
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
                      userSelect: "none",
                    }}
                  >
                    {props.audioLabelName}
                  </Typography>
                  {props.audioDevices && props.audioDevices.length > 1 && (
                    <DropdownArrow
                      sx={{
                        width: "20px",
                        height: "7px",
                        marginLeft:
                          isMobile && props.isVideo && !openAudio
                            ? "0"
                            : "25px",
                        marginRight: "8px",
                      }}
                    />
                  )}
                  {openAudio && (
                    <Box
                      sx={{
                        width: "172px",
                        maxHeight: "170px",
                        borderRadius: "10px 10px 0 0",
                        backgroundColor: "#232323",
                        position: "absolute",
                        bottom: "40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: "12px 4px 4px 4px",
                      }}
                    >
                      {props.audioDevices &&
                        props.audioDevices
                          .filter(
                            (device) => props.audioLabelName !== device.label
                          )
                          .map((device) => {
                            return (
                              <Box
                                sx={{
                                  height: "25px",
                                  textOverflow: "ellipsis",
                                  width: "calc(100% - 24px)",
                                  overflow: "hidden",
                                  padding: "4px 12px",
                                  whiteSpace: "nowrap",
                                  borderRadius: "4px",
                                  "&:hover": {
                                    backgroundColor: "#393939",
                                    cursor: "pointer",
                                  },
                                }}
                                onClick={() => changeSelectedAudio(device)}
                              >
                                <Typography
                                  variant="h12"
                                  sx={{
                                    width: "25px",

                                    fontWeight: 400,
                                    fontSize: "10px",
                                    userSelect: "none",
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
                </Box>
              )}
              {props.videoDevices && (
                <Box
                  sx={{
                    width:
                      isMobile && props.isVideo && !openVideo
                        ? "60px"
                        : "180px",
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
                    position: "relative",
                  }}
                  onClick={() => {
                    setOpenAudio(false);
                    setOpenVideo((open) =>
                      props.videoDevices && props.videoDevices.length > 1
                        ? !open
                        : false
                    );
                  }}
                >
                  {openVideo &&
                    props.videoDevices &&
                    props.videoDevices.length > 1 && (
                      <Box
                        sx={{
                          width: "172px",
                          maxHeight: "130px",
                          borderRadius: "10px 10px 0 0",
                          backgroundColor: "#232323",
                          position: "absolute",
                          bottom: "40px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-evenly",
                          padding: "12px 4px 4px 4px",
                        }}
                      >
                        {props.videoDevices &&
                          props.videoDevices
                            .filter(
                              (device) => props.videoLabelName !== device.label
                            )
                            .map((device) => {
                              return (
                                <Box
                                  sx={{
                                    height: "25px",
                                    textOverflow: "ellipsis",
                                    width: "calc(100% - 24px)",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    padding: "4px 12px",
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
                                      userSelect: "none",
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
                    sx={{
                      width: "21px",
                      height: "15px",
                      marginLeft:
                        isMobile && props.isVideo && !openVideo
                          ? "11px"
                          : "20px",
                    }}
                  />
                  {isMobile && props.isVideo && !openVideo ? (
                    <></>
                  ) : (
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
                        userSelect: "none",
                      }}
                    >
                      {props.videoLabelName}
                    </Typography>
                  )}
                  {props.videoDevices && props.videoDevices.length > 1 && (
                    <DropdownArrow
                      sx={{
                        width: "20px",
                        height: "7px",
                        marginLeft:
                          isMobile && props.isVideo && !openVideo
                            ? "5px"
                            : "16px",
                        marginRight:
                          isMobile && props.isVideo && !openVideo
                            ? "0px"
                            : "8px",
                      }}
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
                marginLeft: isMobile ? "0" : "200px",
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
                  marginRight: "8px",
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
                    marginRight: "8px",
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
                    marginRight: "8px",
                    borderRadius: "10px",
                    backgroundColor: "#232323",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: "#656565",
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
                onClick={onClickStop}
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
                marginLeft: isMobile ? "0" : "190px",
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
                  background: props.isVideo
                    ? `linear-gradient(90deg, #7D7AFF ${props.progress}%, #232323 ${props.progress}%)`
                    : "",
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
