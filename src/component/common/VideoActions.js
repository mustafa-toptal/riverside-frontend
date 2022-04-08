import React, { useEffect, useState } from "react";

function VideoActions(props) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (!props.isPaused) {
        setTimer((seconds) => seconds + 1);
      }
    }, [1000]);

    return () => {
      clearInterval(timerInterval);
    };
  }, [props.isPaused]);

  const getSeconds = () => {
    const result2 = new Date(timer * 1000).toISOString().slice(14, 19);
    return result2;
  };
  return (
    <div className="jGbqEh">
      <button className="joGUys" onClick={props.stop} disabled={props.isPaused}>
        <span className="kZIiFT"></span>
      </button>
      <div className="dqrcjX">
        <div className="gHlgWL">{getSeconds()}</div>
        <div className="eqplYX">
          <button
            className="itReqb"
            style={{
              height: "100%",
              backgroundColor: "rgb(60, 66, 80)",
              border: "none",
              margin: "4px 0 0 0",
            }}
            onClick={props.pause}
          >
            {!props.isPaused ? (
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="dNtjth"
              >
                <rect
                  x="11.334"
                  y="9.69678"
                  width="3.15151"
                  height="12.6061"
                  rx="1.57576"
                  fill="white"
                ></rect>
                <rect
                  x="16.8496"
                  y="9.69678"
                  width="3.15152"
                  height="12.6061"
                  rx="1.57576"
                  fill="white"
                ></rect>
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 30 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="RecordButtonStyled__PlayButton-sc-qh9da9-8 kYIwaQ"
              >
                <path
                  d="M27.3584 22.1849L16.4792 29.2067C16.3935 29.2067 16.3935 29.3029 16.3079 29.3029L5.4286 36.3247C4.91462 36.7095 4.22931 36.9981 3.544 36.9981C1.74507 36.9981 0.203125 35.3628 0.203125 33.2467V19.0106V4.67841C0.203125 4.00508 0.374452 3.42795 0.631442 2.85081C1.57374 1.1194 3.544 0.446076 5.17161 1.50416L16.2222 8.62218L27.1871 15.7402C27.7011 16.0288 28.1294 16.5097 28.4721 17.0868C29.5 18.9144 28.9861 21.223 27.3584 22.1849Z"
                  fill="white"
                ></path>
              </svg>
            )}
          </button>
        </div>
        <div className="eqplYX">
          <svg
            width="2"
            height="24"
            viewBox="0 0 2 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: "100%" }}
          >
            <path opacity="0.3" d="M1 0L0.999999 24" stroke="#192033"></path>
          </svg>
        </div>
        {!props.isPaused && (
          <div className="eqplYX">
            {!props.isMuted ? (
              <svg
                width="12"
                height="16"
                viewBox="0 0 12 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ControlsStyled__MicOn-sc-1vwccvd-10 dEUQBF"
                onClick={props.mute}
              >
                <path
                  d="M6 0.666667C5.46957 0.666667 4.96086 0.87738 4.58579 1.25245C4.21071 1.62753 4 2.13623 4 2.66667V8C4 8.53043 4.21071 9.03914 4.58579 9.41421C4.96086 9.78929 5.46957 10 6 10C6.53043 10 7.03914 9.78929 7.41421 9.41421C7.78929 9.03914 8 8.53043 8 8V2.66667C8 2.13623 7.78929 1.62753 7.41421 1.25245C7.03914 0.87738 6.53043 0.666667 6 0.666667V0.666667Z"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M10.6673 6.66667V8C10.6673 9.23768 10.1757 10.4247 9.30048 11.2998C8.42531 12.175 7.23833 12.6667 6.00065 12.6667C4.76297 12.6667 3.57599 12.175 2.70082 11.2998C1.82565 10.4247 1.33398 9.23768 1.33398 8V6.66667"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M6 12.6667V15.3333"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            ) : (
              <svg
                width="12"
                height="15"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ControlsStyled__MicOff-sc-1vwccvd-11 cfjcLp"
                onClick={props.mute}
              >
                <path
                  d="M6 -1.33325C5.46957 -1.33325 4.96086 -1.12254 4.58579 -0.747466C4.21071 -0.372393 4 0.136315 4 0.666748V6.00008C4 6.53051 4.21071 7.03922 4.58579 7.41429C4.96086 7.78937 5.46957 8.00008 6 8.00008C6.53043 8.00008 7.03914 7.78937 7.41421 7.41429C7.78929 7.03922 8 6.53051 8 6.00008V0.666748C8 0.136315 7.78929 -0.372393 7.41421 -0.747466C7.03914 -1.12254 6.53043 -1.33325 6 -1.33325V-1.33325Z"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M10.6673 4.66675V6.00008C10.6673 7.23776 10.1757 8.42474 9.30048 9.29991C8.42531 10.1751 7.23833 10.6667 6.00065 10.6667C4.76297 10.6667 3.57599 10.1751 2.70082 9.29991C1.82565 8.42474 1.33398 7.23776 1.33398 6.00008V4.66675"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M6 10.6667V13.3334"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M0.666016 10.6667L10.666 0.666748"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoActions;
