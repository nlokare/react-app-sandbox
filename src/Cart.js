import _ from 'lodash';
import React, { useContext } from 'react';
import './App.css';
import { USER_PROFILE, GET_ITEMS } from './queries';
import { PURCHASE } from './mutations';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { AuthContext } from './App';
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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Cart = () => {
  const classes = useStyles();
  const { userToken } = useContext(AuthContext);
  const { loading, data } = useQuery(USER_PROFILE, { 
    variables:  {
      token: userToken || ''
    }
  });
  const { data: inventoryData } = useQuery(GET_ITEMS);
  const [purchase] = useMutation(PURCHASE);
  const pendingOrderItems = _.get(data, 'userProfile.pendingOrder.items');
  const inventoryItems = _.get(inventoryData, 'items');
  return !loading ? (
    <div style={{ marginLeft: '25px', marginTop: '25px' }}>
      <Typography variant="h4">Your Cart</Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(pendingOrderItems, pendingItem => {
              const pendingItemId = pendingItem.id;
              const inventoryItem = _.find(inventoryItems, { id: pendingItemId});
              return (
                <TableRow key={pendingItemId}>
                  <TableCell component="th" scope="row">
                    {inventoryItem.name}
                  </TableCell>
                  <TableCell align="right">{pendingItem.quantity}</TableCell>
                  <TableCell align="left">
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button 
        variant="contained"
        onClick={() => {
          purchase({
            variables: {
              token: userToken,
              order: {
                id: Math.round(Math.random() * 1000),
                items: _.map(pendingOrderItems, item => {
                  return {
                    id: item.id,
                    quantity: item.quantity
                  }
                }),
              }
            }
          });
        }}
      >
        Buy Now!
      </Button>
    </div>
  ) : 'Loading';
}

export default Cart;
