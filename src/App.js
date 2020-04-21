import React from 'react';
import './App.css';
import { ApolloProvider } from '@apollo/react-hooks';
import Dashboard from './Dashboard';
import { withCookies } from 'react-cookie';

export const AuthContext = React.createContext();

const App = ({ client, cookies }) => {
  const userToken = cookies.cookies['userToken'];
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ userToken }}>
        <Dashboard />
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default withCookies(App);
