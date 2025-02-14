import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ccbd9e",
    },
    text: {
      primary: "#d8ccb2",
    },
    background: {
      default: "#2A2344",
      paper: "#495168",
    },
  },
  components: {
    MuiOutlinedInput: {
      defaultProps: {
        size: "medium",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2A2344",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2A2344",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2A2344",
          },
          backgroundColor: "#2A2344",
          color: "#d8ccb2",
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "medium",
      },
      styleOverrides: {
        icon: {
          color: "#ccbd9e",
        },
        select: {
          backgroundColor: "#2A2344",
          color: "#d8ccb2",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#2A2344",
          color: "#d8ccb2",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#2A2344",
          color: "#ccbd9e",
          "&:hover": {
            backgroundColor: "#2A2344",
            opacity: 0.9,
          },
          "&:active": {
            backgroundColor: "#2A2344",
            opacity: 0.8,
          },
        },
      },
      defaultProps: {
        size: "large",
      },
    },
  },
});
