import React, { useState } from 'react';
import { setUserSession } from './Utils/Common';
import { API_URL, PRIMARY_AUTH } from "./constants";
import okta from "./okta.png";
import logo from "./fakeCo.png";


function Login(props) {
  const axios = require('axios');
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  async function handleLogin() {

    setError(null);
    setLoading(true);

    //Login with primary auth api
    const userLogin = await axios.post(API_URL + PRIMARY_AUTH, createLoginRequest(username.value, password.value)).then(
      response => response
    ).catch(error => {
      //Error thrown from login, probably user credentials issue
      setLoading(false);
      console.log(error.response);
      setError("Something went wrong. Please try again.");
    });

    if (userLogin) {
      setLoading(false);
      setUserSession(userLogin.data.sessionToken, userLogin.data._embedded.user);
      props.history.push('/dashboard');
    }

    setLoading(false);
  }

  const createLoginRequest = (username, password) => {
    return {
      'username': username,
      'password': password,
      'options': {}
    };
  }

  return (
    <div className="col-md-12">
      <div className="card card-container card-body text-center">
        <div>
          <img
            src={logo}
            alt="fake-co"
            className="profile-img-card"
            width="40%"
          />
        </div>

        <h4>Login</h4>


        <div className="form-group m-auto">
          <label className="m-auto p-1">Username</label>
          <input type="text" {...username} autoComplete="new-password" className="form-control" />
        </div>
        <div style={{ marginTop: 10 }} className="form-group m-auto">
          <label className="m-auto p-1">Password</label>
          <input type="password" {...password} autoComplete="new-password" className="form-control" />
        </div>
        <div className="form-group m-auto p-1">
          {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
          <input className="btn btn-primary btn-block" type="button" value={loading ? 'Loading...' : 'Login'}
            onClick={handleLogin} disabled={loading} /><br />
        </div>
        <div className="p-3">
          <img width="15%" style={{ float: 'right' }} src={okta} alt='okta'/>
        </div>
      </div>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;