import _ from 'lodash';
import React, { useState } from 'react';
import './App.css';
import { REGISTER, LOGIN } from './mutations';
import { useMutation } from '@apollo/react-hooks';
import { USER_PROFILE } from './queries';
import { useCookies } from 'react-cookie';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookie, setCookie] = useCookies(['cookie-name']);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const updateUserProfile = (cache, { data: auth }) => {
    const authData = auth.regiser || auth.login;
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

  const [register, { error: registrationError }] = useMutation(REGISTER, {
    update: updateUserProfile,
    onCompleted: data => setCookie('userToken', _.get(data, 'register.token')),
  });

  const [login, { error: loginError }] = useMutation(LOGIN, { 
    update: updateUserProfile,
    onCompleted: data => setCookie('userToken', _.get(data, 'login.token')),
   });

  return !loginError && !registrationError ? (
    <div style={{ marginTop: '100px', textAlign: 'center'}}>
      <Typography variant="h4">Grocery Store</Typography>
      <form>
        <TextField 
          id="username" 
          label="Username" 
          onChange={e => setUsername(e.target.value)}
        />
        <br/><br/>
        <TextField 
          id="username" 
          label="Password" 
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <br/><br/>
        <Button 
          variant="contained"
          color="primary"
          onClick={() => {
            register({ 
              variables: { 
                username, 
                password 
              }
            });
          }}
        >
          Register
        </Button>
        <Button 
          variant="contained"
          color="secondary"
          style={{ marginLeft: "20px"}}
          onClick={() => {
            login({ 
              variables: { 
                username, 
                password 
              }
            });
          }}
        >
          Login
        </Button> 
      </form>
    </div>
  ) : 'Error';
}

export default Login;
