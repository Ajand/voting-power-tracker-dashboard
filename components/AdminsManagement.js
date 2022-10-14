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
} from "@mui/material";
import { Add, Clear } from "@mui/icons-material";
import { useState } from "react";

const AdminsManagement = () => {
  const [superAdminEdit, setSuperAdminEdit] = useState(false);

  return (
    <Paper
      css={css`
        padding: 2em;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75em;
        `}
      >
        <Typography variant="body1">Super Admin: 0xqweasdiqwe</Typography>
        <div>
          {superAdminEdit ? (
            <>
              <Button
                onClick={() => {
                  setSuperAdminEdit(false);
                }}
                size="small"
                variant="contained"
                color="primary"
                css={css`
                  margin-right: 0.5em;
                `}
              >
                change
              </Button>
              <Button
                onClick={() => {
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
          />
          <IconButton
            size="small"
            css={css`
              margin-left: 0.5em;
            `}
            color="secondary"
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
          <ListItem
            secondaryAction={
              <IconButton size="small" color="error">
                <Clear />
              </IconButton>
            }
          >
            <ListItemText primary="0xqwe12312" />
          </ListItem>
          <ListItem
            secondaryAction={
              <IconButton size="small" color="error">
                <Clear />
              </IconButton>
            }
          >
            <ListItemText primary="0xqwe12312" />
          </ListItem>
          <ListItem
            secondaryAction={
              <IconButton size="small" color="error">
                <Clear />
              </IconButton>
            }
          >
            <ListItemText primary="0xqwe12312" />
          </ListItem>
          <ListItem
            secondaryAction={
              <IconButton size="small" color="error">
                <Clear />
              </IconButton>
            }
          >
            <ListItemText primary="0xqwe12312" />
          </ListItem>
        </List>
      </div>
    </Paper>
  );
};

export default AdminsManagement;
