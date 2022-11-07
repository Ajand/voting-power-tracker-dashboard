import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  split,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "apollo-link-error";
//import { ApolloLink } from "apollo-link";

const GRAPHQL_SERVER =
  process.env.REACT_APP_HTTP_GRAPHQL_URL || "http://localhost:4000";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphQLErrors", graphQLErrors);
  }
  if (networkError) {
    console.log("networkError", networkError);
  }
});

const httpLink = createUploadLink({
  uri: GRAPHQL_SERVER,
});

const thegraphLink = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/ajand/reflexer_flx",
  // other link options...
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("voting-power-tracker-token");
  // return the headers to the context so httpLink can read them
  if (!token)
    return {
      headers: {
        ...headers,
      },
    };
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

const client = new ApolloClient({
  link: split(
    (operation) => operation.getContext().clientName === "third-graph",
    // the string "third-party" can be anything you want,
    // we will use it in a bit
    thegraphLink, // <= apollo will send to this if clientName is "third-party"
    authLink.concat(ApolloLink.from([errorLink, httpLink]))
    // <= otherwise will send to this
  ),
  cache: new InMemoryCache(),
});

export default client;
