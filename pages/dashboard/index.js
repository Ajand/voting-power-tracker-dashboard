/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Grid, Container } from "@mui/material";

import EventFetchingSetting from "../../components/EventFetchingSettings";
import AdminsManagement from "../../components/AdminsManagement";
import NotificationSettings from "../../components/NotificationSettings";

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
          <NotificationSettings />
          <div
            css={css`
              margin-top: 2em;
            `}
          ></div>
          <EventFetchingSetting />
          <div
            css={css`
              margin-top: 2em;
            `}
          ></div>
          <AdminsManagement />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;