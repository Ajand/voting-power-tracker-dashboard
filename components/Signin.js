/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Paper, Button, Typography, Divider, Avatar } from "@mui/material";
import { useRouter } from "next/router";

const SigninPanel = () => {
  const router = useRouter();

  const signin = () => {
    router.push('/dashboard')
  };

  return (
    <Paper>
      <div
        css={css`
          padding: 2em;
        `}
      >
        <Typography variant="h6">Voting-Power-Tracker Dashboard</Typography>
        <div
          css={css`
            text-align: center;
            margin-top: 1em;
          `}
        >
          <Button
            onClick={signin}
            variant="contained"
            fullWidth
            color="primary"
          >
            Signin
          </Button>
        </div>
      </div>

      <Divider />
      <div
        css={css`
          padding: 0.5em;
          text-align: center;
        `}
      >
        <Typography variant="body2">Sponsored by:</Typography>
        <img src="/reflexer.png" />
      </div>
    </Paper>
  );
};

export default SigninPanel;
