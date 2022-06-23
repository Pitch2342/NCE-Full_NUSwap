import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'
import { AUTH_TOKEN } from '../constants/authToken'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN)
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`
        }
    }
})

const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: {
        authToken: localStorage.getItem(AUTH_TOKEN)
    }
}))

const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql"
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
)

const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
})

export default apolloClient