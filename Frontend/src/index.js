import { ApolloProvider } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from './App'
import apolloClient from "./services/apolloClientProvider";

const theme = {
  fontFamily: 'Inter', 
  colors: {
    purple: ["#E0E0F5", "#CDCDEF", "#B9B9E8", "#A6A6E2", "#9292DB", "#7F7FD5", "#6C6CC6", "#5959B8", "#4545A9", "#32329A"]
  },
  primaryColor: 'blue'
}

const CryptoExchangeApp = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <MantineProvider theme={theme}>
          <App/>
        </MantineProvider>
      </BrowserRouter>
    </ApolloProvider>
  )
}

ReactDOM.render(<CryptoExchangeApp/>, document.getElementById("root"));