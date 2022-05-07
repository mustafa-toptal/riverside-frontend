import React, { useEffect, useRef, useState } from "react";
import { Alert, Box, Grid, Typography } from "@mui/material";
import { VideoStreamMerger } from "video-stream-merger";

import { ScreenRecorder } from "./screen";
import { VideoRecorder } from "./video";
import { AudioRecorder } from "./audio";
import { ScreenVideo } from "./screen-video";
import { delay, isMobileBrowser } from "../../utils/Helpers";
import { WebTitle } from "../common/partials/WebTitle";
import { FileFolders } from "../../icons/FileFolders";
import { AudioWaves } from "../../icons/AudioWaves";

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
  const [showInfo, setShowInfo] = useState(false);
  const [audioInput] = useState("audioinput");
  const [videoInput] = useState("videoinput");

  const mainRef = useRef(null);
  const multiMediaRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    document.body.style = "background-color: #161C21";
    setupListeners();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (recorderType === "screenVideo") {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [recorderType]);

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
    if (type !== "audio") audioRef.current.style = "opacity: 25%";
    if (type !== "multiMedia") multiMediaRef.current.style = "opacity: 25%";
    if (type !== "video") videoRef.current.style = "opacity: 25%";
    if (type !== "screen") screenRef.current.style = "opacity: 25%";
  };

  const enableOption = (type) => {
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

  const renderAlert = (message) => {
    return (
      <Alert
        severity="info"
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          width: "100%",
          padding: 0,
        }}
      >
        {message}
      </Alert>
    );
  };
  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && window["safari"].pushNotification)
    );

  const retake = async () => {
    const prevState = recorderType;
    setRecorderType("");
    await delay(200);
    if (prevState === "screenVideo") {
      setupScreenAndCamera();
    } else if (prevState === "screen") {
      setupStream();
    }
    setRecorderType(prevState);
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
  // return (
  //   <>
  //     {isSafari &&
  //       showInfo &&
  //       renderAlert(
  //         "While using Safari don't minimize the browser for better user experience."
  //       )}

  //     {isMobileBrowser &&
  //       renderAlert("Some features are not available in Mobile Browsers")}
  //     <Grid
  //       container
  //       sx={{
  //         display: "flex",
  //         width: "100%",
  //         height: "100%",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <Box
  //         sx={{
  //           display: "flex",
  //           flexDirection: "row",
  //           alignItems: "center",
  //           justifyContent: "space-evenly",
  //           width: "850px",
  //           marginTop: "80px",
  //         }}
  //       >
  //         {!isMobileBrowser && (
  //           <Box
  //             sx={{
  //               width: "150px",
  //               height: "150px",
  //               borderRadius: "10px",
  //               border: "0.13452375rem dashed #C6CCD9",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               "&:hover": {
  //                 cursor: "pointer",
  //                 backgroundColor: "#afb0b3",
  //                 border: "#FFFFF 5px solid",
  //               },
  //             }}
  //             onClick={() => (recorderType !== "screen" ? setupStream() : "")}
  //           >
  //             Screen
  //           </Box>
  //         )}
  //         <Box
  //           sx={{
  //             width: "150px",
  //             height: "150px",
  //             borderRadius: "10px",
  //             border: "0.13452375rem dashed #C6CCD9",
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             "&:hover": {
  //               cursor: "pointer",
  //               backgroundColor: "#afb0b3",
  //               border: "#FFFFF 5px solid",
  //             },
  //           }}
  //           onClick={() => setRecorderType("audio")}
  //         >
  //           Audio
  //         </Box>
  //         <Box
  //           sx={{
  //             width: "150px",
  //             height: "150px",
  //             borderRadius: "10px",
  //             border: "0.13452375rem dashed #C6CCD9",
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             "&:hover": {
  //               cursor: "pointer",
  //               backgroundColor: "#afb0b3",
  //               border: "#FFFFF 5px solid",
  //             },
  //           }}
  //           onClick={() => setRecorderType("video")}
  //         >
  //           Video
  //         </Box>
  //         {!isMobileBrowser && (
  //           <Box
  //             sx={{
  //               width: "150px",
  //               height: "150px",
  //               borderRadius: "10px",
  //               border: "0.13452375rem dashed #C6CCD9",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               "&:hover": {
  //                 cursor: "pointer",
  //                 backgroundColor: "#afb0b3",
  //                 border: "#FFFFF 5px solid",
  //               },
  //               // textDecoration: "line-through",
  //             }}
  //             onClick={() =>
  //               recorderType !== "screenVideo" ? setupScreenAndCamera() : ""
  //             }
  //           >
  //             Screen & Video
  //           </Box>
  //         )}
  //       </Box>
  //     </Grid>
  //     {recorderType === "screen" && (
  //       <ScreenRecorder
  //         audioDevices={audioDevices}
  //         audio={audio}
  //         stream={stream}
  //         isError={isError}
  //         retake={retake}
  //         errorMessage={errorMessage}
  //         changeAudioDevice={changeAudioDevice}
  //       />
  //     )}
  //     {recorderType === "video" && (
  //       <VideoRecorder
  //         audioDevices={audioDevices}
  //         videoDevices={videoDevices}
  //         retake={retake}
  //       />
  //     )}
  //     {recorderType === "audio" && (
  //       <AudioRecorder audioDevices={audioDevices} retake={retake} />
  //     )}
  //
  //   </>
  // );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "76px",
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
          <WebTitle
            sx={{ color: "#FFFFFF" }}
            title="Multi-Layout Online Recorder"
            subtitle="Pick a Layout for Recording"
          />
          <Box
            ref={mainRef}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "74px",
              width: "970px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              ref={multiMediaRef}
              onClick={() =>
                recorderType !== "screenVideo" ? setupScreenAndCamera() : ""
              }
            >
              <Box
                sx={{
                  height: "148px",
                  width: "220px",
                  borderRadius: "8px",
                  backgroundColor: "#9599FF",
                  backgroundImage: `url(${require("../../utils/images/BgPattern.png")})`,
                  backgroundRepeat: "no-repeat",
                }}
              >
                <FileFolders
                  sx={{
                    width: "26px",
                    height: "120px",
                    float: "right",
                    marginRight: "10px",
                    marginTop: "38px",
                  }}
                  viewBox="0 0 22 120"
                />
                <Box
                  sx={{
                    backgroundSize: "contain",
                    backgroundImage: `url(${require("../../utils/images/ScreenWebcam.png")})`,
                    width: "79px",
                    height: "53px",
                    margin: "85px 0 15px 5px",
                    borderRadius: "5px",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                ></Box>
              </Box>
              {renderLabel("Screen & Webcam Rec")}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => setRecorderType("audio")}
              ref={audioRef}
            >
              <Box
                sx={{
                  height: "148px",
                  width: "220px",
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => setRecorderType("video")}
              ref={videoRef}
            >
              <Box
                sx={{
                  height: "148px",
                  width: "220px",
                  borderRadius: "8px",
                  backgroundColor: "#9599FF",
                  backgroundImage: `url(${require("../../utils/images/VideoRecording.png")})`,
                }}
              ></Box>
              {renderLabel("Webcam Rec")}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              ref={screenRef}
              onClick={() => (recorderType !== "screen" ? setupStream() : "")}
            >
              <Box
                sx={{
                  height: "148px",
                  width: "220px",
                  borderRadius: "8px",
                  backgroundColor: "#9599FF",
                  backgroundImage: `url(${require("../../utils/images/BgPattern.png")})`,
                  backgroundRepeat: "no-repeat",
                }}
              >
                <FileFolders
                  sx={{
                    width: "26px",
                    height: "120px",
                    float: "right",
                    marginRight: "10px",
                    marginTop: "38px",
                  }}
                  viewBox="0 0 22 120"
                />
              </Box>
              {renderLabel("Screen Rec")}
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
      {recorderType === "video" && (
        <VideoRecorder
          audioDevices={audioDevices}
          videoDevices={videoDevices}
          retake={retake}
        />
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
    </Box>
  );
}
