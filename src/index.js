import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { PENDING_ORDER_FRAGMENT } from './queries';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  clientState: { 
    defaults: {
      pendingOrder: null,
    },
    resolvers: {
      User: {
        pendingOrder: (User, _variables, { cache, getCacheKey }) => {
          const id = getCacheKey({
            __typename: 'User',
            id: User.id,
          });
          try {
            const queryResult = cache.readFragment({
              id,
              fragment: PENDING_ORDER_FRAGMENT,
            });
            return queryResult.pendingOrder;
          } catch (e) {
            return {
              __typename: 'pendingOrder',
              id: null,
              items: []
            };
          }
        }
      }
    },
  },
  cache: new InMemoryCache({
    dataIdFromObject: object => object.id,
  })
});

ReactDOM.render(
  <React.StrictMode>
    <App client={client}/>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
