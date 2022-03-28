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
