import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const client  = new ApolloClient ({
    cache: new InMemoryCache(),
    link: createHttpLink({
        uri: 'http://localhost:3000/graphql'
    }),
});

export default client;