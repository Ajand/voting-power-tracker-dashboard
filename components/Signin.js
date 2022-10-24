/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Paper, Button, Typography, Divider, Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useMutation, gql, useQuery } from "@apollo/client";
import client from "../client";

const GET_NONCE = gql`
  mutation getNonce($address: String!) {
    getNonce(address: $address)
  }
`;

const GET_TOKEN = gql`
  mutation getToken($address: String!, $signature: String!) {
    getToken(address: $address, signature: $signature)
  }
`;

const SigninPanel = () => {
  const [getNonce] = useMutation(GET_NONCE);
  const [getToken] = useMutation(GET_TOKEN);

  const router = useRouter();

  const signin = () => {
    var account;
    var signer;
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts) => {
        account = accounts[0];
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // The Metamask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        signer = provider.getSigner();
        console.log(signer, provider.getSigner());
        return signer.getAddress();
      })
      .then(() => {
        return getNonce({
          variables: {
            address: account,
          },
        });
      })
      .then(({ data }) => {
        return signer.signMessage(
          `Signin to Voting Tracker Dashboard with nonce: ${data.getNonce}`
        );
      })
      .then((signature) => {
        return getToken({
          variables: {
            address: account,
            signature,
          },
        });
      })
      .then(({ data }) => {
        const token = data.getToken;
        console.log(token);
        localStorage.setItem("voting-power-tracker-token", token);
        // refetch();
        client.resetStore();
        router.push("/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });
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
