/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Grid, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { gql, useMutation, useQuery } from "@apollo/client";

const ME = gql`
  query me {
    me {
      _id
      address
      superAdmin
    }
  }
`;

import EventFetchingSetting from "../../components/EventFetchingSettings";
import AdminsManagement from "../../components/AdminsManagement";
import EventsTable from "../../components/EventsTable";
import ProcessingSettings from "../../components/ProcessingSettings";
import NotificationSettings from "../../components/NotificationSettings";

const Dashboard = () => {
  const router = useRouter();

  const { loading, error, data, refetch } = useQuery(ME);

  useEffect(() => {
    const token = localStorage.getItem("voting-power-tracker-token");
    if (!token) {
      router.push("/");
    }
  }, []);

  return (
    <Container>
      {loading ? (
        <div>Loading ...</div>
      ) : (
        <>
          <Grid
            container
            spacing={2}
            css={css`
              padding-top: 2em;
            `}
          >
            <Grid item md={5}>
              {/*<NotificationSettings />
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
  ></div> */}
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
              <ProcessingSettings />

              <div
                css={css`
                  margin-top: 2em;
                `}
              ></div>
              <AdminsManagement me={data.me} />
            </Grid>
            <Grid item md={7}>
              <EventsTable />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
