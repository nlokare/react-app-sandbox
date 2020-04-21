import { gql } from 'apollo-boost';

export const REGISTER = gql`
  mutation Register($username: String!, $password:String!) {
    register(username:$username, password: $password) {
      id
      username
      isLoggedIn
      token
      purchases {
        id
        items
      }
      pendingOrder @client {
        id
        items {
          id
          quantity
        }
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username:$username, password: $password) {
      id
      token
      username
      isLoggedIn
      purchases {
        id
        items
      }
      pendingOrder @client {
        id
        name
        quantity
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation logout($token: String!) {
    logout(token: $token)
  }
`;

export const PURCHASE = gql`
  mutation purchase($token: String!, $order: Order!) {
    purchase(token: $token, order: $order)
  } 
`;
