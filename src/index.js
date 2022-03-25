import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";

import { themeOptions } from "../src/theme/Theme";
import App from "./App";
import "./styles/index.css";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={themeOptions}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
