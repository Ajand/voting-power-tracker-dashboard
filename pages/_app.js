import "../styles/globals.css";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import Head from "next/head";

import client from "../client";

const darkTheme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#ECB365",
    },
    secondary: {
      main: "#65ecb4",
    },
    background: {
      default: "#041C32",
      paper: "#04293A",
    },
    error: {
      main: "#FF5E5B",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "rgb(20 21 33 / 18%) 0px 2px 10px 0px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { borderRadius: "8px !important" },
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Voting Power Tracker Dashboard</title>
      </Head>
      <ApolloProvider client={client}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
