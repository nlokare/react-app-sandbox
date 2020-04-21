import React, { useContext } from 'react';
import './App.css';
import { LOGOUT } from './mutations';
import { USER_PROFILE } from './queries';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { AuthContext } from './App';
import Inventory from './Inventory';
import Cart from './Cart';
import Login from './Login';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { userToken } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [cookie, setCookie, removeCookie] = useCookies(['cookie-name']);

  const { loading, data } = useQuery(USER_PROFILE, { 
    variables:  {
      token: userToken || ''
    }
  });

  const updateUserProfile = (cache, { data: auth }) => {
    const authData = auth.register || auth.login;
    cache.writeQuery(({
      query: USER_PROFILE,
      data: {
        userProfile: { 
          ...authData,
          pendingOrder: null 
        }
      }
    }))
  };

  const [logout] = useMutation(LOGOUT, {
    update: updateUserProfile,
    onCompleted: () => removeCookie('userToken'),
  });
  const isValidUser = 
    data && 
    data.userProfile && 
    data.userProfile.token === userToken && 
    data.userProfile.isLoggedIn && 
    !loading;
  return isValidUser ? (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Grocery Store
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => logout({ 
              variables: { 
                token: userToken 
              }
            })}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <Inventory />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
        </Switch>
      </div>
      </Router>
    </div>
  ) : <Login />;
}

export default Dashboard;
