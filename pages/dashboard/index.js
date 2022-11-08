/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Grid, Container, Tabs, Tab } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
import UsersTable from "../../components/UsersTable";

const Dashboard = () => {
  const router = useRouter();

  const [settings, setSettings] = useState("notifs");
  const [tables, setTables] = useState("users");

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
              <Tabs value={settings} onChange={(e, v) => setSettings(v)}>
                <Tab value="notifs" label="Alert Settings" />
                <Tab value="admins" label="Admin Settings" />
              </Tabs>
              <div
                css={css`
                  margin-top: 1em;
                `}
              ></div>
              {settings === "notifs" ? (
                <>
                  <NotificationSettings />
                </>
              ) : (
                <>
                  <AdminsManagement me={data.me} />
                </>
              )}
            </Grid>
            <Grid item md={7}>
              <Tabs value={tables} onChange={(e, v) => setTables(v)}>
                <Tab value="users" label="Users Table" />
                <Tab value="events" label="Events Table" />
              </Tabs>
              <div
                css={css`
                  margin-top: 1em;
                `}
              ></div>
              {tables === "users" ? (
                <>
                  <UsersTable />
                </>
              ) : (
                <>
                  <EventsTable />
                </>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
