import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';

import BaseApplication from './App';
import { createSchemaLink } from './resolvers'

//import useScript from './hooks'

const client = new ApolloClient({
  link: createSchemaLink(),
  cache: new InMemoryCache()
});


function App() {
  //useScript('https://unpkg.com/ipfs@0.35.0/dist/index.min.js');
  //useScript('https://www.unpkg.com/orbit-db@0.25.3/dist/orbitdb.min.js');

  return (
    <ApolloProvider client={client}>
      <BaseApplication />
    </ApolloProvider>
  );
}

render(<App />, document.getElementById('root'));
