import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';

import BaseApplication from './App';

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BaseApplication />
    </ApolloProvider>
  );
}

render(<App />, document.getElementById('root'));
