import React from "react";
import { Typography } from "@mui/material";

export const encodeToken = (token) => {
  return btoa(token);
};

export const pxToRem = (px) => {
  return `${px / 16}rem`;
};

export const renderTitle = (title, highlightedWordIndex) => {
  return (
    <>
      {title.split(" ").map((word, index) => {
        if (index + 1 === highlightedWordIndex) {
          return (
            <span key={index}>
              <font color="#7d7aff">{word + " "}</font>
            </span>
          );
        } else {
          return <span key={index}>{word + " "}</span>;
        }
      })}
    </>
  );
};

export const animatedText = (text) => {
  return (
    <div className="logo is-animation">
      {text}
      <Typography variant="h12">.</Typography>
      <Typography variant="h12">.</Typography>
      <Typography variant="h12">.</Typography>
    </div>
  );
};

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const uploadFile = async (file, config) => {
  const { fields } = config;
  const fd = new FormData();
  const key = fields.Key;
  const url = `https://${fields.bucket}.s3.amazonaws.com/`;
  fd.append("key", key);
  fd.append("X-Amz-Credential", fields["X-Amz-Credential"]);
  fd.append("X-Amz-Algorithm", fields["X-Amz-Algorithm"]);
  fd.append("X-Amz-Date", fields["X-Amz-Date"]);
  fd.append("Policy", fields["Policy"]);
  fd.append("X-Amz-Signature", fields["X-Amz-Signature"]);
  fd.append("file", file);

  const params = {
    method: "post",
    headers: {
      fd,
    },
    body: fd,
  };

  const data = await fetch(url, params);
  if (!data.ok) return Promise.reject(data);
  return Promise.resolve({
    result: data,
  });
};

export const deleteFile = async ({
  url,
  date,
  amzDate,
  signature,
  contentType,
}) => {
  console.log("signature: ", signature);
  const fd = new FormData();
  fd.append("Date", date);
  fd.append("X-Amz-Date", amzDate);
  fd.append("Authorization", signature);
  fd.append("Content-Type", contentType);

  const params = {
    method: "delete",
    headers: {
      fd,
    },
  };
  console.log("params: ", params);

  const deleteResult = await fetch(url, params);
  if (!deleteResult.ok) return Promise.reject(deleteResult);
  return Promise.resolve({
    message: "File Deleted",
  });
};
