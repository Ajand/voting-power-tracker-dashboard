/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Paper, Typography, Chip, TextField, Button } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const FETCHER = gql`
  {
    fetcher {
      status
      tokenAddress
      tokenCreationBlock
      lastFetchedBlock
    }
  }
`;

const START_FETCHING = gql`
  mutation StartFetching($tokenAddress: String!, $tokenCreationBlock: String!) {
    startFetching(
      tokenAddress: $tokenAddress
      tokenCreationBlock: $tokenCreationBlock
    )
  }
`;

const PAUSE_FETCHING = gql`
  mutation Mutation {
    pauseFetching
  }
`;

const RESUME_FETCHING = gql`
  mutation Mutation {
    resumeFetching
  }
`;

const RESET_FETCHING = gql`
  mutation Mutation {
    resetFetching
  }
`;

const EventFetchingSetting = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenCreationBlock, setTokenCreationBlock] = useState("");

  const { loading, error, data, refetch, startPolling, stopPolling } =
    useQuery(FETCHER);

  const [startFetching] = useMutation(START_FETCHING);
  const [pauseFetching] = useMutation(PAUSE_FETCHING);
  const [resumeFetching] = useMutation(RESUME_FETCHING);
  const [resetFetching] = useMutation(RESET_FETCHING);

  useEffect(() => {
    if (data && data.fetcher) {
      setTokenAddress(data.fetcher.tokenAddress);
      setTokenCreationBlock(data.fetcher.tokenCreationBlock);
    }
  }, [data]);

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
                startFetching({
                  variables: {
                    tokenAddress,
                    tokenCreationBlock: String(tokenCreationBlock),
                  },
                })
                  .then((r) => {
                    refetch();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              disabled={!ethers.utils.isAddress(tokenAddress)}
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
                pauseFetching()
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
                resumeFetching()
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
                resetFetching()
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
          {StatusRenderer(data.fetcher.status)}
        </div>

        {ActionButtonRenderer(data.fetcher.status)}
      </div>
      <div>
        {data.fetcher.status !== 0 ? (
          <>
            <div>
              <Typography
                css={css`
                  margin-top: 1em;
                `}
                variant="body1"
              >
                Token Address: {data.fetcher.tokenAddress}
              </Typography>
              <Typography
                css={css`
                  margin-top: 0.5em;
                `}
                variant="body1"
              >
                Token Creation Block: {data.fetcher.tokenCreationBlock}
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
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              error={!!tokenAddress && !ethers.utils.isAddress(tokenAddress)}
              helperText={
                tokenAddress &&
                !ethers.utils.isAddress(tokenAddress) &&
                "Must be an ethereum address"
              }
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Token Creation Block"
              size="small"
              css={css`
                margin-top: 0.75em;
              `}
              type="number"
              value={tokenCreationBlock}
              onChange={(e) => setTokenCreationBlock(e.target.value)}
            />
          </>
        )}
      </div>
      {data.fetcher.status > 0 && (
        <div>
          <Typography
            css={css`
              margin-top: 0.5em;
            `}
            variant="body1"
          >
            Last Fetched Block: {data.fetcher.lastFetchedBlock}
          </Typography>
        </div>
      )}
    </Paper>
  );
};

export default EventFetchingSetting;
