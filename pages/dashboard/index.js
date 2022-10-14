/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Grid, Container } from "@mui/material";

import EventFetchingSetting from "../../components/EventFetchingSettings";

const Dashboard = () => {
  return (
    <Container>
      <Grid
        container
        spacing={2}
        css={css`
          padding-top: 2em;
        `}
      >
        <Grid item md={6}>
          <EventFetchingSetting />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
