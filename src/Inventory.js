import _ from 'lodash';
import React, { useContext, useState } from 'react';
import './App.css';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { AuthContext } from './App';
import { USER_PROFILE, GET_ITEMS } from './queries';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Inventory = () => {
  let history = useHistory();
  const classes = useStyles();
  const cache = useApolloClient();
  const { userToken } = useContext(AuthContext);
  const [shoppingCart, setShoppingCart] = useState({});
  const { loading, data } = useQuery(GET_ITEMS);
  const { data: user } = useQuery(USER_PROFILE, { 
    variables: {
      token: userToken
    }
  });
  const items = _.get(data, 'items');

  const updateShoppingCart = item => {
    let cart = _.cloneDeep(shoppingCart);
    if (cart.hasOwnProperty(item.id)) {
      cart[item.id] = {
        id: item.id,
        name: item.name,
        quantity: cart[item.id].quantity + 1
      }
    } else {
      cart[item.id] = {
        id: item.id,
        name: item.name,
        quantity: 1
      }
    }
    setShoppingCart(cart);
  };

  const checkout = () => {
    const cart = _.map(_.keys(shoppingCart), id => {
      return {
        id,
        quantity: shoppingCart[id].quantity,
        __typename: 'ItemInput',
      }
    });
    cache.writeData({ 
      id: `${user.userProfile.id}`, 
      data: {
        pendingOrder: {
          __typename: 'Order',
          id: `User:${user.userProfile.id}`,
          items: cart.slice()
        }
      }
    });
    history.push('/cart');
  };

  return !loading ? (
    <div>
      <div style={{ marginLeft: '25px', marginTop: '25px' }}>
        <Typography variant="h4">Inventory</Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Remaining</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(items, item => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="left">
                    <Button 
                      variant="contained"
                      onClick={() => {
                        updateShoppingCart(item);
                        item.quantity = item.quantity - 1;
                      }}
                    >
                      Add to cart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ marginLeft: '25px', marginTop: '25px' }}>
        <Typography variant="h4">Shopping Cart</Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(_.keys(shoppingCart), itemId => {
                const item = shoppingCart[itemId];
                return (
                  <TableRow key={itemId}>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <br/>
        <Button variant="contained" onClick={checkout}>Go to checkout</Button>
      </div>    
    </div>
  ) : "Loading";
}

export default Inventory;
