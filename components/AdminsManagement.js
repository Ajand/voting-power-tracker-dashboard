/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Add, Clear } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ethers } from "ethers";

const ADMINS = gql`
  query admins {
    admins {
      _id
      address
      superAdmin
    }
  }
`;

const ADD_ADMIN = gql`
  mutation addAdmin($address: String!) {
    addAdmin(address: $address)
  }
`;

const DELETE_ADMIN = gql`
  mutation deleteAdmin($targetAddress: String!) {
    deleteAdmin(targetAddress: $targetAddress)
  }
`;

const CHANGE_SUPER_ADMIN = gql`
  mutation changeSuperAdmin($targetAddress: String!) {
    changeSuperAdmin(targetAddress: $targetAddress)
  }
`;

const AdminsManagement = ({ me }) => {
  const [superAdminEdit, setSuperAdminEdit] = useState(false);

  const { loading, error, data, refetch } = useQuery(ADMINS);

  const [superAdminAddress, setSuperAdminAddress] = useState("");
  const [adminAddress, setAdminAddress] = useState("");

  const [addAdmin] = useMutation(ADD_ADMIN);
  const [deleteAdmin] = useMutation(DELETE_ADMIN);
  const [changeSuperAdmin] = useMutation(CHANGE_SUPER_ADMIN);

  useEffect(() => {
    if (data && data.admins) {
      setSuperAdminAddress(
        data.admins.find((admin) => admin.superAdmin).address
      );
    }
  }, [data]);

  return (
    <Paper
      css={css`
        padding: 2em;
      `}
    >
      {loading ? (
        <div>Loading ...</div>
      ) : (
        <>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 0.75em;
            `}
          >
            {superAdminEdit ? (
              <div
                css={css`
                  width: calc(100% - 200px);
                `}
              >
                <TextField
                  label="Super Admin"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={superAdminAddress}
                  onChange={(e) => setSuperAdminAddress(e.target.value)}
                  error={!ethers.utils.isAddress(superAdminAddress)}
                  helperText={
                    !ethers.utils.isAddress(superAdminAddress) &&
                    "Must be an ethereum address"
                  }
                />
              </div>
            ) : (
              <>
                <Typography
                  variant="body1"
                  css={css`
                    font-size: 0.9em;
                  `}
                >
                  Super Admin:{" "}
                  {data.admins.find((admin) => admin.superAdmin).address}
                </Typography>
              </>
            )}

            <div>
              {superAdminEdit ? (
                <>
                  <Button
                    onClick={() => {
                      changeSuperAdmin({
                        variables: { targetAddress: superAdminAddress },
                      }).then(() => {
                        refetch();
                      });
                      setSuperAdminEdit(false);
                    }}
                    size="small"
                    variant="contained"
                    color="primary"
                    css={css`
                      margin-right: 0.5em;
                    `}
                    disabled={
                      !ethers.utils.isAddress(superAdminAddress) ||
                      data.admins
                        .find((admin) => admin.superAdmin)
                        .address.toLowerCase() ===
                        superAdminAddress.toLowerCase()
                    }
                  >
                    change
                  </Button>
                  <Button
                    onClick={() => {
                      setSuperAdminAddress(
                        data.admins.find((admin) => admin.superAdmin).address
                      );
                      setSuperAdminEdit(false);
                    }}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  >
                    cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setSuperAdminEdit(true);
                    }}
                    size="small"
                    variant="text"
                    color="primary"
                    disabled={!me.superAdmin}
                  >
                    edit
                  </Button>
                </>
              )}
            </div>
          </div>
          <Divider />
          <div
            css={css`
              margin-top: 0.75em;
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="New admin address"
                name="adminAddress"
                value={adminAddress}
                onChange={(e) => setAdminAddress(e.target.value)}
                error={!!adminAddress && !ethers.utils.isAddress(adminAddress)}
                helperText={
                  adminAddress &&
                  !ethers.utils.isAddress(adminAddress) &&
                  "Must be an ethereum address"
                }
              />
              <IconButton
                size="small"
                css={css`
                  margin-left: 0.5em;
                `}
                color="secondary"
                disabled={
                  !ethers.utils.isAddress(adminAddress) || !me.superAdmin
                }
                onClick={() => {
                  addAdmin({ variables: { address: adminAddress } }).then(
                    () => {
                      refetch();
                      setAdminAddress("");
                    }
                  );
                }}
              >
                <Add />
              </IconButton>
            </div>
            <List
              css={css`
                margin-top: 1em;
              `}
              dense
            >
              {data.admins
                .filter((admin) => !admin.superAdmin)
                .map((admin) => (
                  <ListItem
                    key={admin.address}
                    secondaryAction={
                      <IconButton
                        disabled={!me.superAdmin}
                        size="small"
                        color="error"
                        onClick={() => {
                          deleteAdmin({
                            variables: { targetAddress: admin.address },
                          }).then(() => {
                            refetch();
                          });
                        }}
                      >
                        <Clear />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={admin.address} />
                  </ListItem>
                ))}
            </List>
          </div>
        </>
      )}
    </Paper>
  );
};

export default AdminsManagement;
