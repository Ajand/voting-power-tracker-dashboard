import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "apollo-link-error";

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
  link: authLink.concat(ApolloLink.from([errorLink, httpLink])),

  cache: new InMemoryCache(),
});

export default client;
