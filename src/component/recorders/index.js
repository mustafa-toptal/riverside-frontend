import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { VideoStreamMerger } from "video-stream-merger";
import { useMediaQuery } from "react-responsive";

import { ScreenRecorder } from "./screen";
import { VideoRecorder } from "./video";
import { AudioRecorder } from "./audio";
import { ScreenVideo } from "./screen-video";
import { FileFolders } from "../../icons/FileFolders";
import { AudioWaves } from "../../icons/AudioWaves";
import { useResponsiveQuery } from "../../utils/hooks/useResponsiveQuery";

export function Recorders() {
  const [recorderType, setRecorderType] = useState("");
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audio, setAudio] = useState(null);
  const [stream, setStrem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setError] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [mergedStream, setMergedStream] = useState(null);
  // eslint-disable-next-line
  const [showInfo, setShowInfo] = useState(false);
  const [audioInput] = useState("audioinput");
  const [videoInput] = useState("videoinput");

  const mainRef = useRef(null);
  const multiMediaRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const screenRef = useRef(null);

  const isMobile = useResponsiveQuery();
  const shouldBreak = useMediaQuery({ query: `(max-width: 1000px)` });
  const [boxWidth, setBoxWidth] = useState(220);
  const [boxHeight, setBoxHeight] = useState(148);

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  const title = params.title;
  const subtitle = params.subtitle;
  const marginTop = params.marginTop;
  const titleWidth = params.titleWidth;
  const subTitleWidth = params.subTitleWidth;
  const boxGap = params.boxGap

  useEffect(() => {
    if (isMobile && boxWidth !== 144) {
      setBoxHeight(97);
      setBoxWidth(144);
    } else if (!isMobile && boxWidth !== 200) {
      setBoxHeight(148);
      setBoxWidth(220);
    }
  }, [isMobile, boxWidth]);

  useEffect(() => {
    document.body.style = "background-color: #161C21";
    setupListeners();
    setupAudioVideoStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (recorderType === "screenVideo") {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [recorderType]);

  async function setupAudioVideoStream() {
    let audioDevices = [];
    let videoDevices = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(() => {
        navigator.mediaDevices
          .enumerateDevices()
          .then((data) => {
            for (let i = 0; i < data.length; i++) {
              const device = data[i];
              if (device.kind === audioInput) {
                audioDevices.push(device);
              } else if (device.kind === videoInput) {
                videoDevices.push(device);
              }
            }
            setAudioDevices(audioDevices);
            setVideoDevices(videoDevices);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }

  async function setupStream(audioDevice) {
    try {
      if (!audioDevice) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setStrem(stream);
      }
      let audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      };
      if (audioDevice) {
        audioConstraints.deviceId = audioDevice;
      }
      const audio = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });
      setAudio(audio);
      setRecorderType("screen");
      setError(false);
      setErrorMessage(``);
    } catch (err) {
      setRecorderType("screen");
      setError(true);
      setErrorMessage(`${err}`);
    }
  }

  async function setupScreenAndCamera(videoDevice, audioDevice) {
    setShowInfo(true);
    function roundedImage(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    let merger = new VideoStreamMerger();
    const screenMediaOptions = {
      video: {
        width: 1920,
        height: 1080,
        aspectRatio: 1920 / 1080,
        cursor: "never",
        frameRate: 25,
      },
      audio: false,
    };

    let cameraMediaOptions = {
      video: {
        width: 300,
        height: 300,
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    };
    if (videoDevice) {
      cameraMediaOptions.video.deviceId = videoDevice;
    } else {
      cameraMediaOptions.video.deviceId = videoDevices[0].deviceId;
    }
    if (audioDevice) {
      cameraMediaOptions.audio.deviceId = audioDevice;
    }
    try {
      let localScreenStream = null;
      if (!audioDevice && !videoDevice) {
        localScreenStream = await navigator.mediaDevices.getDisplayMedia(
          screenMediaOptions
        );
      }
      const cameraStream = await navigator.mediaDevices.getUserMedia(
        cameraMediaOptions
      );
      // Add the screen capture. Position it to fill the whole stream (the default)
      merger.width = 1920;
      merger.height = 1080;
      merger.addStream(localScreenStream ? localScreenStream : screenStream, {
        x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
        mute: true, // we don't want sound from the screen (if there is any)
      });

      // Add the webcam stream. Position it on the bottom left and resize it to 100x100.
      merger.addStream(cameraStream, {
        draw: (ctx, frame, done) => {
          const x = 50;
          const y = merger.height - 350;
          const width = 450;
          const height = 300;
          ctx.save();
          roundedImage(ctx, x, y, width, height, 20.5333);
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 8;
          ctx.stroke();
          // ctx.scale(-1, 1);
          ctx.clip();
          ctx.drawImage(frame, x, y, width, height);
          ctx.restore();
          done();
        },
        x: 50,
        y: merger.height - 250,
        width: 350,
        height: 200,
        mute: false,
      });

      // Start the merging. Calling this makes the result available to us
      merger.start();

      setCameraStream(cameraStream);
      setScreenStream(localScreenStream ? localScreenStream : screenStream);
      setMergedStream(merger.result);
      setRecorderType("screenVideo");
      setError(false);
      setErrorMessage(``);
    } catch (err) {
      setError(true);
      setErrorMessage(`${err}`);
      setRecorderType("screenVideo");
      console.error("Error: " + err);
    }
  }

  const disableOptions = (type) => {
    if (type === "audio") {
      multiMediaRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      videoRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      screenRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      audioRef.current.style = "opacity: 1";
    }
    if (type === "multiMedia") {
      videoRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      screenRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      audioRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      multiMediaRef.current.style = "opacity: 1";
    }
    if (type === "video") {
      multiMediaRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      screenRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      audioRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      videoRef.current.style = "opacity: 1";
    }
    if (type === "screen") {
      multiMediaRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      videoRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      audioRef.current.style.animation =
        "0.2s ease-in 0s 1 normal forwards running screenAnimation";
      screenRef.current.style = "opacity: 1";
    }
  };

  const enableOption = () => {
    audioRef.current.style = "opacity: 1";
    multiMediaRef.current.style = "opacity: 1";
    videoRef.current.style = "opacity: 1";
    screenRef.current.style = "opacity: 1";
  };

  const changeDevice = (videoDevice, audioDevice) => {
    setupScreenAndCamera(videoDevice, audioDevice);
  };

  const changeAudioDevice = (audioDevice) => {
    setupStream(audioDevice);
  };

  // const renderAlert = (message) => {
  //   return (
  //     <Alert
  //       severity="info"
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         position: "fixed",
  //         width: "100%",
  //         padding: 0,
  //       }}
  //     >
  //       {message}
  //     </Alert>
  //   );
  // };
  // const isSafari =
  //   /constructor/i.test(window.HTMLElement) ||
  //   (function (p) {
  //     return p.toString() === "[object SafariRemoteNotification]";
  //   })(
  //     !window["safari"] ||
  //       (typeof safari !== "undefined" && window["safari"].pushNotification)
  //   );

  const retake = async () => {
    const prevState = recorderType;
    setRecorderType("retake");
    if (prevState === "screenVideo") {
      setupScreenAndCamera();
    } else if (prevState === "screen") {
      setupStream();
    }
    setTimeout(() => {
      setRecorderType(prevState);
    }, 500);
  };

  const setupListeners = () => {
    mainRef.current.addEventListener("mouseleave", (e) => {
      e.preventDefault();
      enableOption();
    });
    multiMediaRef.current.addEventListener("mouseenter", (e) => {
      e.preventDefault();
      enableOption();
      disableOptions("multiMedia");
    });
    audioRef.current.addEventListener("mouseenter", (e) => {
      e.preventDefault();
      enableOption();
      disableOptions("audio");
    });
    videoRef.current.addEventListener("mouseenter", (e) => {
      e.preventDefault();
      enableOption();
      disableOptions("video");
    });
    screenRef.current.addEventListener("mouseenter", (e) => {
      e.preventDefault();
      enableOption();
      disableOptions("screen");
    });
    document.body.style = "background-color: #161C21";
  };

  const renderLabel = (text) => {
    return (
      <Typography
        variant="h12"
        sx={{
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "36px",
          letterSpacing: "0.01em",
          textAlign: "center",
          color: "#FFFFFF",
          marginTop: "7px",
        }}
      >
        {text}
      </Typography>
    );
  };

  const renderMobileOverlay = () => {
    if (!isMobile) {
      return null;
    }
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: 99999,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "15px",
            width: "80%",
          }}
        >
          Desktop-Only Feature
        </Typography>
      </Box>
    );
  };

  const renderScreenAndVideo = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          "&:hover": {
            cursor: isMobile ? "not-allowed" : "pointer",
          },
          animationFillMode: "forwards",         
        }}
        ref={multiMediaRef}
        onClick={() =>
          !isMobile &&
          (recorderType !== "screenVideo" ? setupScreenAndCamera() : "")
        }
      >
        <Box
          sx={{
            height: boxHeight,
            width: boxWidth,
            borderRadius: "8px",
            backgroundColor: "#9599FF",
            backgroundImage: `url(${require("../../utils/images/BgPattern.png")})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            position: "relative",
          }}
        >
          {renderMobileOverlay()}
          <FileFolders
            sx={{
              width: "26px",
              height: isMobile ? "90%" : "120px",
              float: "right",
              marginRight: isMobile ? "5px" : "10px",
              marginTop: isMobile ? "2%" : "38px",
            }}
            viewBox="0 0 22 120"
          />
          <Box
            sx={{
              backgroundSize: "contain",
              backgroundImage: `url(${require("../../utils/images/ScreenWebcam.png")})`,
              width: "79px",
              height: "53px",
              margin: isMobile ? "40px 0 15px 5px" : "85px 0 15px 5px",
              borderRadius: "5px",
              "&:hover": {
                cursor: "pointer",
              },
            }}
          ></Box>
        </Box>
        {isMobile ? (
          <Typography
            variant="h12"
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "23.56px",
              letterSpacing: "0.01em",
              textAlign: "center",
              color: "#6a6a6a",
              marginTop: "7px",
              width: "80%",
            }}
          >
            {"Screen & Webcam Rec"}
          </Typography>
        ) : (
          renderLabel("Screen & Webcam Rec")
        )}
      </Box>
    );
  };
  const renderAudio = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          "&:hover": {
            cursor: "pointer",
          },
          animationFillMode: "forwards",
        }}
        onClick={() => setRecorderType("audio")}
        ref={audioRef}
      >
        <Box
          sx={{
            height: boxHeight,
            width: boxWidth,
            borderRadius: "8px",
            backgroundColor: "#7D7AFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AudioWaves
            sx={{
              width: "52px",
              height: "38px",
            }}
          />
        </Box>
        {renderLabel("Audio Rec")}
      </Box>
    );
  };
  const renderWebCam = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          "&:hover": {
            cursor: "pointer",
          },
          animationFillMode: "forwards",
        }}
        onClick={() => setRecorderType("video")}
        ref={videoRef}
      >
        <Box
          sx={{
            height: boxHeight,
            width: boxWidth,
            borderRadius: "8px",
            backgroundColor: "#9599FF",
            backgroundImage: `url(${require("../../utils/images/VideoRecording.png")})`,
            backgroundSize: "contain",
          }}
        ></Box>
        {renderLabel("Webcam Rec")}
      </Box>
    );
  };
  const renderScreen = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          "&:hover": {
            cursor: isMobile ? "not-allowed" : "pointer",
          },
          animationFillMode: "forwards",
        }}
        ref={screenRef}
        onClick={() =>
          !isMobile && (recorderType !== "screen" ? setupStream() : "")
        }
      >
        <Box
          sx={{
            height: boxHeight,
            width: boxWidth,
            borderRadius: "8px",
            backgroundColor: "#9599FF",
            backgroundImage: `url(${require("../../utils/images/BgPattern.png")})`,
            backgroundRepeat: "no-repeat",
            position: "relative",
            backgroundSize: "contain",
          }}
        >
          {renderMobileOverlay()}
          <FileFolders
            sx={{
              width: "26px",
              float: "right",
              height: isMobile ? "90%" : "120px",
              marginRight: isMobile ? "5px" : "10px",
              marginTop: isMobile ? "2%" : "38px",
            }}
            viewBox="0 0 22 120"
          />
        </Box>
        {isMobile ? (
          <Typography
            variant="h12"
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "36px",
              letterSpacing: "0.01em",
              textAlign: "center",
              color: "#6a6a6a",
              marginTop: "7px",
              width: "80%",
            }}
          >
            Screen Rec
          </Typography>
        ) : (
          renderLabel("Screen Rec")
        )}
      </Box>
    );
  };

  return (
    <>
      <style>
        {`#root{
        display: flex;
        align-items: center;
        justify-content: center;
      }`}
      </style>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop : marginTop ? `${marginTop}px` : isMobile ? "0px" : "-6%",
          "& .MuiTypography-h1": {
            fontSize: " 50px",
            lineHeight: "55px",
            width: "440px",
            fontWeight: 900,
          },
          "& .MuiTypography-h6": {
            fontSize: "24px",
            lineHeight: "30px",
            fontWeight: 400,
            marginTop: "11px",
          },
        }}
      >
        {!recorderType && (
          <>
            <Grid container spacing={0}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    fontSize: isMobile ? "40px" : "50px",
                    lineHeight: isMobile ? "48px" : "55px",
                    color: "#ffffff",
                    fontWeight: "800",
                    textAlign: "center",
                    width: titleWidth ? `${titleWidth}px` : "auto"
                  }}
                >
                  {title ? (
                    title
                  ) : (
                    <>
                      Multi-Layout <br /> Online Recorder
                    </>
                  )}
                </Typography>
                <Typography
                  sx={{
                    fontSize: isMobile ? "18px" : "24px",
                    lineHeight: isMobile ? "26px" : "30px",
                    color: "#ffffff",
                    textAlign: "center",
                    marginTop: "10px",
                    maxWidth:  subTitleWidth ? `${subTitleWidth}px` : "500px",
                  }}
                >
                  {subtitle ? subtitle : "Pick a Layout for Recording"}
                </Typography>
              </Grid>
            </Grid>
            <Box
              ref={mainRef}
              sx={{
                display: "flex",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "flex-start",
                marginTop: boxGap ? `${boxGap}px` : "7%",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1,
                  marginRight: isMobile ? "8px" : "15px",
                  flexDirection: shouldBreak ? "column-reverse" : "row",
                }}
              >
                <Box
                  sx={{
                    marginRight: shouldBreak ? "0" : "15px",
                  }}
                >
                  {renderScreenAndVideo()}
                </Box>
                <Box
                  sx={{
                    marginLeft: shouldBreak ? "0" : "15px",
                    marginBottom: shouldBreak ? "15px" : 0,
                  }}
                >
                  {renderAudio()}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1,
                  marginLeft: isMobile ? "8px" : "15px",
                  flexDirection: shouldBreak ? "column" : "row",
                }}
              >
                <Box
                  sx={{
                    marginRight: shouldBreak ? "0" : "15px",
                    marginBottom: shouldBreak ? "15px" : 0,
                  }}
                >
                  {renderWebCam()}
                </Box>
                <Box
                  sx={{
                    marginLeft: shouldBreak ? "0" : "15px",
                  }}
                >
                  {renderScreen()}
                </Box>
              </Box>
            </Box>
          </>
        )}
        {recorderType === "screenVideo" && (
          <ScreenVideo
            mergedStream={mergedStream}
            screenStream={screenStream}
            cameraStream={cameraStream}
            isError={isError}
            errorMessage={errorMessage}
            audioDevices={audioDevices}
            videoDevices={videoDevices}
            changeDevice={changeDevice}
            retake={retake}
          />
        )}
        {recorderType === "audio" && (
          <AudioRecorder audioDevices={audioDevices} retake={retake} />
        )}
        {recorderType === "video" ? (
          <VideoRecorder
            audioDevices={audioDevices}
            videoDevices={videoDevices}
            retake={retake}
          />
        ) : (
          <></>
        )}
        {recorderType === "screen" && (
          <ScreenRecorder
            audioDevices={audioDevices}
            audio={audio}
            stream={stream}
            isError={isError}
            retake={retake}
            errorMessage={errorMessage}
            changeAudioDevice={changeAudioDevice}
          />
        )}
      </Box>{" "}
    </>
  );
}
