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

const graphqlServer =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000";

  console.log(process.env.NEXT_PUBLIC_GRAPHQL_URL)

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphQLErrors", graphQLErrors);
  }
  if (networkError) {
    console.log("networkError", networkError);
  }
});

const httpLink = createUploadLink({
  uri: graphqlServer,
});

const thegraphLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
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
