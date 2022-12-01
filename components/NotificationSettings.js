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
import { gql, useMutation, useQuery } from "@apollo/client";
import { ethers } from "ethers";

const PROCESSOR = gql`
  {
    processor {
      status
      processed
      fetched
      lastProcessedBlock
      alertSettings
      processFrom
    }
  }
`;

const RESET_PROCESSING = gql`
  mutation Mutation {
    resetProcessing
  }
`;

const START_PROCESSING = gql`
  mutation StartProcessing($notifSettings: String!, $processingCursor: Int) {
    startProcessing(
      notifSettings: $notifSettings
      processingCursor: $processingCursor
    )
  }
`;

const NotificationSettings = () => {
  const [manualCursor, setManualCurosr] = useState(false);
  const [notifSetting, setNotifSetting] = useState(null);
  const [processingCursor, setPC] = useState("");

  const [resetProcessing] = useMutation(RESET_PROCESSING);
  const [startProcessing] = useMutation(START_PROCESSING);

  const { loading, error, data, refetch, startPolling, stopPolling } =
    useQuery(PROCESSOR);

  useEffect(() => {
    startPolling(1000);
    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (data && data.processor.alertSettings) {
      setNotifSetting(JSON.parse(data.processor.alertSettings));
    }
  }, [data]);

  useEffect(() => {
    setPC("");
  }, [manualCursor]);

  const changeNotifSetting = (variant, key) => (value) => {
    const nNotifS = { ...notifSetting };
    nNotifS[variant][key] = value;
    setNotifSetting(nNotifS);
  };

  const formatResult = (notifSettings) => {
    let nS = {};
    Object.entries(notifSettings).forEach((item) => {
      nS[item[0]] = {};
      Object.entries(item[1]).forEach((inside) => {
        nS[item[0]][inside[0]] = isNaN(inside[1])
          ? inside[1]
          : Number(inside[1]);
      });
    });
    return nS;
  };

  const isVal = (notifSettings) => {
    let isValid = true;
    Object.entries(notifSettings).forEach((item) => {
      Object.entries(item[1]).forEach((inside) => {
        if (inside[1] === "") {
          isValid = false;
        }
        if (
          item[0] === "amount" ||
          item[0] === "percent" ||
          item[0] === "timeframe"
        ) {
          if (isNaN(inside[1])) {
            isValid = false;
          }
        }
      });
    });
    return isValid;
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
            <Button
              onClick={() => {
                console.log(formatResult(notifSetting));
                startProcessing({
                  variables: {
                    notifSettings: JSON.stringify(formatResult(notifSetting)),
                    processingCursor: Number(processingCursor),
                  },
                })
                  .then(() => {
                    refetch();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              disabled={!isVal(notifSetting)}
              size="small"
              variant="contained"
              color="primary"
            >
              Start
            </Button>
          </>
        );
      default:
        return (
          <>
            <Button
              onClick={() =>
                resetProcessing()
                  .then((r) => {
                    refetch();
                  })
                  .catch((err) => {
                    console.log(err);
                  })
              }
              size="small"
              variant="outlined"
              color="error"
            >
              Stop
            </Button>
          </>
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
          Alerting From:{" "}
          {data.processor.processFrom
            ? data.processor.processFrom
            : "Current Block"}
        </Typography>
      );

    return (
      <div
        css={css`
          margin-bottom: 0.5em;
        `}
      >
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
            label={manualCursor ? "Manual" : "Automatic from current block"}
          />
        </div>
        {manualCursor && (
          <>
            <TextField
              label="Processing Cursor"
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              value={processingCursor}
              onChange={(e) => setPC(Number(e.target.value))}
              css={css`
                margin-top: 0.5em;
              `}
            />
          </>
        )}
      </div>
    );
  };

  if (!data || !notifSetting) return <div></div>;

  const currentStatus = data.processor.status;

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
      {ProcessingCursor(currentStatus)}{" "}
      {currentStatus !== 0 && (
        <>
          <Typography
            css={css`
              margin-top: 0.5em;
            `}
            variant="body1"
          >
            Processed Events: {data.processor.processed}
          </Typography>
          <Typography
            css={css`
              margin-top: 0.5em;
            `}
            variant="body1"
          >
            Fetched Events: {data.processor.fetched}
          </Typography>
          <Typography
            css={css`
              margin-top: 0.5em;
              margin-bottom: 1em;
            `}
            variant="body1"
          >
            Last Processed Block: {data.processor.lastProcessedBlock}
          </Typography>
          <Divider />
        </>
      )}
      {currentStatus == 0 ? (
        <>
          {" "}
          <div>
            <FormControlLabel
              onChange={() =>
                changeNotifSetting(
                  "delegateRelative",
                  "active"
                )(!notifSetting.delegateRelative.active)
              }
              control={
                <Checkbox checked={notifSetting.delegateRelative.active} />
              }
              label={"Delegation Relative To Total Tokens"}
            />
            {!!notifSetting.delegateRelative.active && (
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
                  type="number"
                  value={notifSetting.delegateRelative.percent}
                  onChange={(e) =>
                    changeNotifSetting(
                      "delegateRelative",
                      "percent"
                    )(e.target.value)
                  }
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "delegateRelative",
                      "message"
                    )(e.target.value)
                  }
                  multiline
                  helperText="use $changeAmount$, $percent$, $at$, $delegatee$, $percent$, $amount$,$time$, 
                  $from$, $resolvedFrom$, $to$, $resolvedTo$, $prevBalance$, $finalBalance$, $prevVp$ and $finalVp$, placeholders"
                  css={css`
                    margin-bottom: 0.75em;
                  `}
                />
                <TextField
                  variant="outlined"
                  label="Timeframe (hour)"
                  size="small"
                  onChange={(e) =>
                    changeNotifSetting(
                      "delegateRelative",
                      "timeframe"
                    )(e.target.value)
                  }
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
              control={
                <Checkbox checked={notifSetting.delegateAmount.active} />
              }
              label={"Delegation Absolute Change"}
            />
            {!!notifSetting.delegateAmount.active && (
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "delegateAmount",
                      "amount"
                    )(e.target.value)
                  }
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "delegateAmount",
                      "message"
                    )(e.target.value)
                  }
                  multiline
                  helperText="use  $changeAmount$, $percent$, $at$, $delegatee$, $percent$, $amount$, $time$, $from$, $resolvedFrom$, $to$, $resolvedTo$, $prevBalance$, $finalBalance$, $prevVp$ and $finalVp$ placeholders"
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "delegateAmount",
                      "timeframe"
                    )(e.target.value)
                  }
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
              control={
                <Checkbox checked={notifSetting.transferRelative.active} />
              }
              label={"Transfer Relative To Total Tokens"}
            />
            {!!notifSetting.transferRelative.active && (
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "transferRelative",
                      "percent"
                    )(e.target.value)
                  }
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "transferRelative",
                      "message"
                    )(e.target.value)
                  }
                  multiline
                  helperText="use  $changeAmount$, $percent$, $at$, $percent$, $time$, $amount, $time$, $from$, $resolvedFrom$, $to$, $resolvedTo$, $prevBalance$, $finalBalance$, $prevVp$ and $finalVp$  placeholders"
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "transferRelative",
                      "timeframe"
                    )(e.target.value)
                  }
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
              control={
                <Checkbox checked={notifSetting.transferAmount.active} />
              }
              label={"Transfer Absolute Change"}
            />
            {!!notifSetting.transferAmount.active && (
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "transferAmount",
                      "amount"
                    )(e.target.value)
                  }
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "transferAmount",
                      "message"
                    )(e.target.value)
                  }
                  multiline
                  helperText="use  $changeAmount$, $percent$, $at$, $amount$, $to$, $time$, $percent$, $from$, $resolvedFrom$, $to$, $resolvedTo$, $prevBalance$, $finalBalance$, $prevVp$ and $finalVp$ placeholders"
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
                  onChange={(e) =>
                    changeNotifSetting(
                      "transferAmount",
                      "timeframe"
                    )(e.target.value)
                  }
                  css={css`
                    margin-bottom: 0.75em;
                  `}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            css={css`
              margin-top: 1em;
              margin-bottom: 0.75em;
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <Typography variant="body1">Relative Delegation</Typography>
              <Chip
                size="small"
                variant={
                  notifSetting.delegateRelative.active
                    ? "contained"
                    : "outlined"
                }
                label={
                  notifSetting.delegateRelative.active ? "active" : "deactive"
                }
              />
            </div>
            {!!notifSetting.delegateRelative.active && (
              <>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Threshold Percent: {notifSetting.delegateRelative.percent}%
                </Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Message: {notifSetting.delegateRelative.message}
                </Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Timeframe: {notifSetting.delegateRelative.timeframe}h
                </Typography>
              </>
            )}
          </div>
          <Divider />
          <div
            css={css`
              margin-top: 1em;
              margin-bottom: 0.75em;
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <Typography variant="body1">Absolute Delegation</Typography>
              <Chip
                size="small"
                variant={
                  notifSetting.delegateAmount.active ? "contained" : "outlined"
                }
                label={
                  notifSetting.delegateAmount.active ? "active" : "deactive"
                }
              />
            </div>
            {!!notifSetting.delegateAmount.active && (
              <>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Threshold Amount: {notifSetting.delegateAmount.amount}
                </Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Message: {notifSetting.delegateAmount.message}
                </Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Timeframe: {notifSetting.delegateAmount.timeframe}h
                </Typography>
              </>
            )}
          </div>
          <Divider />
          <div
            css={css`
              margin-top: 1em;
              margin-bottom: 0.75em;
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <Typography variant="body1">Relative Transfer</Typography>
              <Chip
                size="small"
                variant={
                  notifSetting.transferRelative.active
                    ? "contained"
                    : "outlined"
                }
                label={
                  notifSetting.transferRelative.active ? "active" : "deactive"
                }
              />
            </div>
            {!!notifSetting.transferRelative.active && (
              <>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Threshold Percent: {notifSetting.transferRelative.percent}%
                </Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Message: {notifSetting.transferRelative.message}
                </Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Timeframe: {notifSetting.transferRelative.timeframe}h
                </Typography>
              </>
            )}
          </div>
          <Divider />
          <div
            css={css`
              margin-top: 1em;
              margin-bottom: 0.75em;
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <Typography variant="body1">Absolute Transfer</Typography>
              <Chip
                size="small"
                variant={
                  notifSetting.transferAmount.active ? "contained" : "outlined"
                }
                label={
                  notifSetting.transferAmount.active ? "active" : "deactive"
                }
              />
            </div>
            {!!notifSetting.transferAmount.active && (
              <>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Threshold Percent: {notifSetting.transferAmount.amount}
                </Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Message: {notifSetting.transferAmount.message}
                </Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-top: 0.5em;
                  `}
                >
                  Timeframe: {notifSetting.transferAmount.timeframe}h
                </Typography>
              </>
            )}
          </div>
        </>
      )}
    </Paper>
  );
};

export default NotificationSettings;
