/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Paper, Typography, Chip, TextField, Button } from "@mui/material";

const EventFetchingSetting = () => {
  const StatusRenderer = (sts) => {
    switch (sts) {
      case 0:
        return <Chip size="small" label="Pending" color="error" />;
      case 1:
        return <Chip size="small" label="Running" color="secondary" />;
      case 2:
        return <Chip size="small" label="Paused" color="warning" />;
    }
  };

  const ActionButtonRenderer = (sts) => {
    switch (sts) {
      case 0:
        return (
          <>
            <Button size="small" variant="contained" color="primary">
              Start
            </Button>
          </>
        );
      case 1:
        return (
          <>
            <Button size="small" variant="outlined" color="primary">
              Pause
            </Button>
          </>
        );
      case 2:
        return (
          <div>
            <Button
              css={css`
                margin-right: 0.5em;
              `}
              size="small"
              variant="contained"
              color="secondary"
            >
              Start
            </Button>
            <Button size="small" variant="text" color="error">
              Reset
            </Button>
          </div>
        );
    }
  };

  const currentStatus = 1;

  return (
    <Paper
      css={css`
        padding: 2em;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <Typography
          variant="body1"
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <span
            css={css`
              margin-right: 0.5em;
            `}
          >
            Status:
          </span>{" "}
          {StatusRenderer(currentStatus)}
        </Typography>
        {ActionButtonRenderer(currentStatus)}
      </div>
      <div>
        {currentStatus === 1 ? (
          <>
            <div>
              <Typography
                css={css`
                  margin-top: 1em;
                `}
                variant="body1"
              >
                Token Address: 0xas123we123123
              </Typography>
              <Typography
                css={css`
                  margin-top: 0.5em;
                `}
                variant="body1"
              >
                Token Creation Block: 1230000
              </Typography>
            </div>
          </>
        ) : (
          <>
            <TextField
              variant="outlined"
              fullWidth
              label="Token Address"
              size="small"
              css={css`
                margin-top: 1em;
              `}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Token Creation Block"
              size="small"
              css={css`
                margin-top: 0.75em;
              `}
            />
          </>
        )}
      </div>
      <div>
        <Typography
          css={css`
            margin-top: 1em;
          `}
          variant="body1"
        >
          Last Fetched Block: 1230000
        </Typography>
        <Typography
          css={css`
            margin-top: 0.5em;
          `}
          variant="body1"
        >
          Last Processed Block: 1230000
        </Typography>
      </div>
    </Paper>
  );
};

export default EventFetchingSetting;
