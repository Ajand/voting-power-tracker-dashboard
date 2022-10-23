/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Paper,
  Typography,
  Chip,
  TextField,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Switch,
  Checkbox,
} from "@mui/material";
import { useState, useEffect } from "react";

const NotificationSettings = () => {
  const [manualCursor, setManualCurosr] = useState(false);
  const [notifSetting, setNotifSetting] = useState(null);

  useEffect(() => {
    setNotifSetting({
      delegateRelative: {
        active: true,
        percent: 1,
        message:
          "Voting power of $delegatee$ increased $percent$ in $time$ hours",
        timeframe: 24,
      },
      delegateAmount: {
        active: true,
        amount: 10000000,
        message:
          "Voting power of $delegatee$ increased $amount$ in $time$ hours",
        timeframe: 24,
      },
      transferRelative: {
        active: true,
        percent: 1.5,
        message: "$percent$% of tokens transfered to $to$ in $time$ hours",
        timeframe: 24,
      },
      transferAmount: {
        active: true,
        amount: 20000000,
        message: "$amount$ tokens transfered from $from$ to $to$",
        timeframe: 24,
      },
    });
  }, []);

  const changeNotifSetting = (variant, key) => (value) => {
    const nNotifS = { ...notifSetting };
    nNotifS[variant][key] = value;
    setNotifSetting(nNotifS);
  };

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

  const ProcessingCursor = (sts) => {
    if (sts === 1)
      return (
        <Typography
          css={css`
            margin-top: 0.5em;
          `}
          variant="body1"
        >
          Token Creation Block: 1230000
        </Typography>
      );

    return (
      <div>
        <div
          css={css`
            display: flex;
            align-items: center;
            margin-top: 0.75em;
          `}
        >
          <Typography
            variant="body1"
            css={css`
              margin-right: 1em;
            `}
          >
            Block Cursor:{" "}
          </Typography>
          <FormControlLabel
            onChange={() => setManualCurosr(!manualCursor)}
            control={<Switch checked={!manualCursor} size="small" />}
            label={manualCursor ? "Manual" : "Automatic"}
          />
        </div>
        {manualCursor && (
          <>
            <TextField
              label="Processing Cursor"
              variant="outlined"
              size="small"
              fullWidth
              css={css`
                margin-top: 0.5em;
              `}
            />
          </>
        )}
      </div>
    );
  };

  const currentStatus = 1;

  if (!notifSetting) return <div></div>;

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
          variant="body1 "
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
          </span>
          {StatusRenderer(currentStatus)}
        </Typography>
        {ActionButtonRenderer(currentStatus)}
      </div>
      {ProcessingCursor(currentStatus)}
      <div>
        <FormControlLabel
          onChange={() =>
            changeNotifSetting(
              "delegateRelative",
              "active"
            )(!notifSetting.delegateRelative.active)
          }
          control={<Checkbox checked={notifSetting.delegateRelative.active} />}
          label={"Delegation Relative To Total Tokens"}
        />
        {notifSetting.delegateRelative.active && (
          <div
            css={css`
              margin-top: 0.5em;
            `}
          >
            <TextField
              variant="outlined"
              label="Percentage (%)"
              size="small"
              fullWidth
              value={notifSetting.delegateRelative.percent}
              css={css`
                margin-bottom: 0.75em;
              `}
            />
            <TextField
              variant="outlined"
              label="Message"
              size="small"
              fullWidth
              value={notifSetting.delegateRelative.message}
              multiline
              helperText="use $delegatee$, $percent$ and $time$ placeholders"
              css={css`
                margin-bottom: 0.75em;
              `}
            />
            <TextField
              variant="outlined"
              label="Timeframe (hour)"
              size="small"
              fullWidth
              value={notifSetting.delegateRelative.timeframe}
              css={css`
                margin-bottom: 0.75em;
              `}
            />
          </div>
        )}
      </div>
      <div>
        <FormControlLabel
          onChange={() =>
            changeNotifSetting(
              "delegateAmount",
              "active"
            )(!notifSetting.delegateAmount.active)
          }
          control={<Checkbox checked={notifSetting.delegateAmount.active} />}
          label={"Delegation Absolute Change"}
        />
        {notifSetting.delegateAmount.active && (
          <div
            css={css`
              margin-top: 0.5em;
            `}
          >
            <TextField
              variant="outlined"
              label="Amount"
              size="small"
              fullWidth
              value={notifSetting.delegateAmount.amount}
              css={css`
                margin-bottom: 0.75em;
              `}
            />
            <TextField
              variant="outlined"
              label="Message"
              size="small"
              fullWidth
              value={notifSetting.delegateAmount.message}
              multiline
              helperText="use $delegatee$, $amount$ and $time$ placeholders"
              css={css`
                margin-bottom: 0.75em;
              `}
            />
            <TextField
              variant="outlined"
              label="Timeframe (hour)"
              size="small"
              fullWidth
              value={notifSetting.delegateAmount.timeframe}
              css={css`
                margin-bottom: 0.75em;
              `}
            />
          </div>
        )}
      </div>
      <div>
        <FormControlLabel
          onChange={() =>
            changeNotifSetting(
              "transferRelative",
              "active"
            )(!notifSetting.transferRelative.active)
          }
          control={<Checkbox checked={notifSetting.transferRelative.active} />}
          label={"Transfer Relative To Total Tokens"}
        />
        {notifSetting.transferRelative.active && (
          <div
            css={css`
              margin-top: 0.5em;
            `}
          >
            <TextField
              variant="outlined"
              label="Percentage (%)"
              size="small"
              fullWidth
              value={notifSetting.transferRelative.percent}
              css={css`
                margin-bottom: 0.75em;
              `}
            />
            <TextField
              variant="outlined"
              label="Message"
              size="small"
              fullWidth
              value={notifSetting.transferRelative.message}
              multiline
              helperText="use $percent$, $to$ and $time$ placeholders"
              css={css`
                margin-bottom: 0.75em;
              `}
            />
            <TextField
              variant="outlined"
              label="Timeframe (hour)"
              size="small"
              fullWidth
              value={notifSetting.transferRelative.timeframe}
              css={css`
                margin-bottom: 0.75em;
              `}
            />
          </div>
        )}
      </div>
      <div>
        <FormControlLabel
          onChange={() =>
            changeNotifSetting(
              "transferAmount",
              "active"
            )(!notifSetting.transferAmount.active)
          }
          control={<Checkbox checked={notifSetting.transferAmount.active} />}
          label={"Transfer Absolute Change"}
        />
        {notifSetting.transferAmount.active && (
          <div
            css={css`
              margin-top: 0.5em;
            `}
          >
            <TextField
              variant="outlined"
              label="Amount"
              size="small"
              fullWidth
              value={notifSetting.transferAmount.amount}
              css={css`
                margin-bottom: 0.75em;
              `}
            />
            <TextField
              variant="outlined"
              label="Message"
              size="small"
              fullWidth
              value={notifSetting.transferAmount.message}
              multiline
              helperText="use $amount$, $to$ and $time$ placeholders"
              css={css`
                margin-bottom: 0.75em;
              `}
            />
            <TextField
              variant="outlined"
              label="Timeframe (hour)"
              size="small"
              fullWidth
              value={notifSetting.transferAmount.timeframe}
              css={css`
                margin-bottom: 0.75em;
              `}
            />
          </div>
        )}
      </div>
    </Paper>
  );
};

export default NotificationSettings;
