import { gql } from 'apollo-boost';

export const PENDING_ORDER_FRAGMENT = gql`
  fragment userPendingOrder on User {
    id
    username
    pendingOrder @client{
      id
      items {
        id
        quantity
      }
    }
  }
`;

export const USER_PROFILE = gql`
  query User($token: String!) {
    userProfile(token: $token) {
      id
      username
      isLoggedIn
      purchases {
        id
        items
      }
      token
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

export const GET_ITEMS = gql`
  query Items {
    items {
      id
      name
      quantity
    }
  }
`;