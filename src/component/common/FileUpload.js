import React, { useRef, useState } from "react";
import { FileDrop } from "react-file-drop";

import { Progress } from "../converter/partials/Progress";

export const FileUpload = (props) => {
  const {
    isMobile,
    onFileSelect,
    text,
    inputFormat,
    icon,
    hideTitle,
    isTranscription,
  } = props;

  const [dragEvent, setDragevent] = useState("");

  const fileInputRef = useRef(null);

  const onFileInputChange = (event) => {
    const { files } = event.target;
    onFileSelect(files[0]);
  };

  const onTargetClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <FileDrop
        onDrop={(files) => {
          onFileSelect(files[0]);
          setDragevent("drop");
        }}
        onTargetClick={onTargetClick}
        onFrameDragEnter={(event) => {
          setDragevent("enter");
        }}
        onFrameDragLeave={(event) => {
          setDragevent("leave");
        }}
      >
        <Progress
          icon={icon}
          isMobile={isMobile}
          text={text}
          dragEvent={dragEvent}
          hideTitle={hideTitle}
          isTranscription={isTranscription}
        />
      </FileDrop>
      <input
        onChange={onFileInputChange}
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept={`${inputFormat}`}
      />
    </>
  );
};
