/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Paper, Typography, Chip, TextField, Button } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const PROCESSOR = gql`
  {
    processor {
      status
      processed
      fetched
      lastProcessedBlock
    }
  }
`;

const START_PROCESSING = gql`
  mutation Mutation {
    startProcessing
  }
`;

const PAUSE_PROCESSING = gql`
  mutation Mutation {
    pauseProcessing
  }
`;

const RESUME_PROCESSING = gql`
  mutation Mutation {
    resumeProcessing
  }
`;

const RESET_PROCESSING = gql`
  mutation Mutation {
    resetProcessing
  }
`;

const EventProcessingSetting = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenCreationBlock, setTokenCreationBlock] = useState("");

  const { loading, error, data, refetch, startPolling, stopPolling } =
    useQuery(PROCESSOR);

  const [startProcessing] = useMutation(START_PROCESSING);
  const [pauseProcessing] = useMutation(PAUSE_PROCESSING);
  const [resumeProcessing] = useMutation(RESUME_PROCESSING);
  const [resetProcessing] = useMutation(RESET_PROCESSING);

  useEffect(() => {
    startPolling(1000);
    return () => stopPolling();
  }, []);

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
                startProcessing({})
                  .then((r) => {
                    refetch();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              size="small"
              variant="contained"
              color="primary"
            >
              Start
            </Button>
          </>
        );
      case 1:
        return (
          <>
            <Button
              onClick={() => {
                pauseProcessing()
                  .then((r) => {
                    refetch();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              size="small"
              variant="outlined"
              color="primary"
            >
              Pause
            </Button>
          </>
        );
      case 2:
        return (
          <div>
            <Button
              onClick={() => {
                resumeProcessing()
                  .then((r) => {
                    refetch();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              css={css`
                margin-right: 0.5em;
              `}
              size="small"
              variant="contained"
              color="secondary"
            >
              Resume
            </Button>
            <Button
              onClick={() => {
                resetProcessing()
                  .then((r) => {
                    refetch();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              size="small"
              variant="text"
              color="error"
            >
              Reset
            </Button>
          </div>
        );
    }
  };

  if (loading && !data) return <div></div>;

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
        <div
          css={css`
            display: flex;
            align-items: center;
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
          </Typography>
          {StatusRenderer(data.processor.status)}
        </div>
        {ActionButtonRenderer(data.processor.status)}
      </div>
      <div>
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
          `}
          variant="body1"
        >
          Last Processed Block: {data.processor.lastProcessedBlock}
        </Typography>
      </div>
    </Paper>
  );
};

export default EventProcessingSetting;
