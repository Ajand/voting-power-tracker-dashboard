/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { TableHead } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

const EVENTS = gql`
  query Events($limit: Int!, $offset: Int!) {
    events(limit: $limit, offset: $offset) {
      items {
        name
        blockNumber
        transactionHash
        processed
      }
      count
    }
  }
`;

const USERS = gql`
  query Users($limit: Int!, $offset: Int!, $orderBy: String!) {
    users(
      first: $limit
      skip: $offset
      orderBy: $orderBy
      orderDirection: "desc"
    ) {
      id
      balance
      votingPower
      balanceHistory {
        id
        amount
        block {
          id
          number
          at
          totalSupply
        }
      }
      votingPowerHistory {
        id
        amount
        block {
          id
          number
          at
          totalSupply
        }
      }
    }
  }
`;

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}

export default function CustomPaginationActionsTable() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [orderBy, setOrderBy] = useState("votingPower");

  const { data, loading, error, startPolling, stopPolling } = useQuery(USERS, {
    variables: {
      limit,
      offset,
      orderBy,
    },
    context: { clientName: "third-graph" },
  });

  useEffect(() => {
    startPolling(13 * 1000);
    return () => stopPolling();
  }, []);

  const handleChangePage = (event, newPage) => {
    setOffset(newPage * limit);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value);
    setLimit(parseInt(event.target.value, 10));
    setOffset(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="row" align="center">
              Address
            </TableCell>
            <TableCell
              css={css`
                cursor: pointer;
              `}
              onClick={() => setOrderBy("balance")}
              component="th"
              scope="row"
              align="center"
            >
              Balance
            </TableCell>
            <TableCell
              css={css`
                cursor: pointer;
              `}
              onClick={() => setOrderBy("votingPower")}
              component="th"
              scope="row"
              align="center"
            >
              Voting Power
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>Loading User Data</TableCell>
            </TableRow>
          ) : (
            data.users.map((user, i) => (
              <TableRow key={`${i}${user.id}`}>
                <TableCell align="center" component="th" scope="row">
                  <a
                    href={`https://etherscan.io/address/${user.id}`}
                    target="_blank"
                    css={(theme) =>
                      css`
                        color: ${theme.palette.primary.main};
                      `
                    }
                  >
                    {user.id.substring(0, 5)}...
                    {user.id.substring(user.id.length - 5, user.id.length)}
                  </a>
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user.balance}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user.votingPower}
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                ></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={5000}
              rowsPerPage={limit}
              page={parseInt(offset / limit)}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
