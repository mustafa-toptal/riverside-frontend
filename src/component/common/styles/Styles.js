import { makeStyles } from "@mui/styles";

import { pxToRem } from "../../../utils/Helpers";

export const useTitleStyles = makeStyles({
  titleMain: {
    display: "flex",
    alignItems: "center",
    marginTop: pxToRem(65),
    flexDirection: "column",
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  mobileTitle: {
    fontWeight: "800",
    fontSize: pxToRem(40),
    textAlign: "center",
    lineHeight: pxToRem(48),
  },
  subTitleWrapper: {
    display: "flex",
    alignItems: "center",
    width: pxToRem(216),
    height: pxToRem(56),
  },
  mobileSubtitle: {
    fontWeight: "700",
    fontSize: pxToRem(22),
    textAlign: "center",
    width: pxToRem(216),
    height: pxToRem(56),
    lineHeight: pxToRem(28),
  },
  webTitle: {
    fontWeight: "800",
    fontSize: pxToRem(50),
    width: pxToRem(765),
    textAlign: "center",
    lineHeight: pxToRem(55),
  },
  webSubtitle: {
    fontWeight: "700",
    fontSize: pxToRem(30),
  },
  webTranscriptionSubtitle: {
    fontSize: pxToRem(18),
    fontWeight: "500",
    textAlign: "center",
    width: pxToRem(520),
    marginTop: pxToRem(30),
  },
  mobileTranscriptionTitle: {
    fontSize: pxToRem(32),
    textAlign: "center",
    fontWeight: "900",
    lineHeight: pxToRem(34),
    width: pxToRem(340),
  },
  transcriptionSubtitleWrapper: {
    width: pxToRem(330),
    height: pxToRem(56),
    display: "flex",
    alignItems: "center",
    marginTop: pxToRem(30),
  },
  mobileTranscrioptionSubtitle: {
    height: pxToRem(56),
    fontSize: pxToRem(16),
    textAlign: "center",
    fontWeight: "500",
    lineHeight: pxToRem(24),
  },
});

export const useFileUploadStyles = (isCompressor) => makeStyles({
  webStyles: {
    border: `${pxToRem(2.15238)} dashed #C6CCD9`,
    boxSizing: "border-box",
    borderRadius: pxToRem(21.5238),
    width: isCompressor ? pxToRem(840) :pxToRem(497),
    height: isCompressor ? pxToRem(188) :pxToRem(205),
    marginTop: isCompressor ? pxToRem(16) :pxToRem(44),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  mobileStyles: {
    width: pxToRem(343),
    height: pxToRem(255),
    left: pxToRem(16),
    top: pxToRem(246),
    border: "2px dashed #C6CCD9",
    boxSizing: "border-box",
    borderRadius: pxToRem(20),
    marginTop: isCompressor ? pxToRem(30) : pxToRem(38),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  webTextWrapper: {
    display: "flex",
    alignItems: "center",
    height: pxToRem(40),
    width: isCompressor ? pxToRem(300) :pxToRem(307),
  },
  webText: {
    fontWeight: 400,
    fontSize: pxToRem(14),
    lineHeight: pxToRem(20),
    letterSpacing: "0.01em",
    textAlign: "center",
  },
  phoneText: {
    fontWeight: 400,
    fontSize: pxToRem(14),
    lineHeight: pxToRem(20),
    letterSpacing: "0.01em",
    textAlign: "center",
    marginTop: pxToRem(5),
  },
  uploadContent: {
    fontWeight: 800,
    fontSize: pxToRem(24),
  },
  progressContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
    height: isCompressor ? "45%" :"80%",
  },
  progressText: {
    fontWeight: "600",
    fontSize: pxToRem(14),
    marginBottom: pxToRem(13),
  },
  rangeWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    "& .MuiLinearProgress-colorPrimary": {
      backgroundColor: "#FFFFFF",
    },
  },
  range: {
    width: pxToRem(184),
    borderRadius: pxToRem(8),
    height: pxToRem(8),
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#161C21",
      borderRadius: pxToRem(8),
    },
    marginRight: pxToRem(5),
  },
  cancelIcon: {
    height: pxToRem(14),
    width: pxToRem(14),
    "&:hover": {
      cursor: "pointer",
    },
  },
  downloadButton: {
    backgroundColor: isCompressor ? "rgba(149, 153, 255, 1)" :"#161C21",
    color: "#FFFFFF",
    height: pxToRem(40),
    width: pxToRem(270),
    borderRadius: pxToRem(10),
    "&:hover": {
      backgroundColor: isCompressor ? "rgba(149, 153, 255, 1)" :"#161C21",
    },
  },
  buttonTextWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "40%",
  },
  downloadIcon: {
    width: pxToRem(13),
    height: pxToRem(13),
  },
  buttonText: {
    fontWeight: "700",
    fontSize: pxToRem(13),
  },
});

export const useDialogStyles = (isMobile) => {
  return makeStyles({
    dialog: {
      "& .MuiDialog-paper": {
        width: "80%",
        // maxHeight: 430,
        borderRadius: pxToRem(10),
        height: pxToRem(320),
      },
      "& .MuiDialogContent-root": {
        padding: `${pxToRem(16)} ${pxToRem(5)}`,
      },
    },
    dialogContent: {
      cursor: "pointer",
      position: "absolute",
      top: pxToRem(12),
      left: isMobile ? "92%" : "95%",
    },
    closeIcon: {
      height: pxToRem(12),
      width: pxToRem(11),
      position: "absolute",
    },
    contentWrapper: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "column",
      height: "100%",
    },
    header: {
      fontSize: pxToRem(30),
      fontWeight: 800,
      lineHeight: pxToRem(30),
      alignSelf: "center",
    },
    fileTypeContainer: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "row",
    },
    fileTypes: {
      width: isMobile ? pxToRem(88) : pxToRem(100),
      height: isMobile ? pxToRem(88) : pxToRem(100),
      borderRadius: isMobile ? pxToRem(8.55) : pxToRem(10),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    fileTypeIcon: {
      width: isMobile ? pxToRem(65) : pxToRem(47),
      height: isMobile ? pxToRem(65) : pxToRem(76),
    },
  });
};

export const useAlertMessageStyles = (isMobile) => {
  return makeStyles({
    snackbar: {
      width: pxToRem(270),
      left: isMobile ? "15%" : "50%",
      right: isMobile ? "25%" : "auto",
      top: pxToRem(24),
      "& .MuiPaper-root": {
        alignItems: "center",
        justifyContent: "center",
        "& .MuiSnackbarContent-message": {
          width: isMobile ? "90%" : "75%",
        },
      },
    },
    snackbarContent: {
      height: pxToRem(52),
      borderRadius: pxToRem(10),
      opacity: "0.85 !important",
    },
    message: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      color: "white",
    },
  });
};
